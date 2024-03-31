/**
 * Some code is modified based on
 * https://github.com/swc-project/swc/blob/5dacaa174baaf6bf40594d79d14884c8c2fc0de2/crates/swc/src/lib.rs
 * Apache-2.0 licensed
 * Author Donny/강동윤
 * Copyright (c)
 */
use std::env;
use std::{path::PathBuf, sync::Arc};

use crate::ast::javascript::{Ast as JsAst, Context as JsAstContext, Program as JsProgram};
use anyhow::{Context, Error};
use dashmap::DashMap;
use swc_config::config_types::BoolOr;
use swc_core::base::config::{BuiltInput, Config, IsModule, JsMinifyCommentOption};
use swc_core::base::SwcComments;
use swc_core::common::comments::{Comment, CommentKind, Comments};
use swc_core::common::errors::{Handler, HANDLER};
use swc_core::common::{
    comments::SingleThreadedComments, FileName, FilePathMapping, Mark, SourceMap, GLOBALS,
};
use swc_core::common::{BytePos, SourceFile};
use swc_core::ecma::ast::{EsVersion, Program};
use swc_core::ecma::parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax,
};
use swc_core::ecma::transforms::base::helpers::{self, Helpers};
use swc_core::ecma::visit::{Fold, FoldWith};
use swc_core::{
    base::{config::Options, try_with_handler},
    common::Globals,
};

fn minify_file_comments(
    comments: &SingleThreadedComments,
    preserve_comments: BoolOr<JsMinifyCommentOption>,
) {
    match preserve_comments {
        BoolOr::Bool(true) | BoolOr::Data(JsMinifyCommentOption::PreserveAllComments) => {}

        BoolOr::Data(JsMinifyCommentOption::PreserveSomeComments) => {
            let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                // Preserve license comments.
                //
                // See https://github.com/terser/terser/blob/798135e04baddd94fea403cfaab4ba8b22b1b524/lib/output.js#L175-L181
                vc.retain(|c: &Comment| {
                    c.text.contains("@lic")
                        || c.text.contains("@preserve")
                        || c.text.contains("@copyright")
                        || c.text.contains("@cc_on")
                        || (c.kind == CommentKind::Block && c.text.starts_with('!'))
                });
                !vc.is_empty()
            };
            let (mut l, mut t) = comments.borrow_all_mut();

            l.retain(preserve_excl);
            t.retain(preserve_excl);
        }

        BoolOr::Bool(false) => {
            let (mut l, mut t) = comments.borrow_all_mut();
            l.clear();
            t.clear();
        }
    }
}

pub struct SwcCompiler {
    cm: Arc<SourceMap>,
    fm: Arc<SourceFile>,
    comments: SingleThreadedComments,
    options: Options,
    globals: Globals,
    helpers: Helpers,
    config: Config,
}

impl SwcCompiler {
    fn parse_js(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        target: EsVersion,
        syntax: Syntax,
        is_module: IsModule,
        comments: Option<&dyn Comments>,
    ) -> Result<Program, Error> {
        let mut error = false;

        let mut errors = vec![];
        let program_result = match is_module {
            IsModule::Bool(true) => {
                parse_file_as_module(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Module)
            }
            IsModule::Bool(false) => {
                parse_file_as_script(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Script)
            }
            IsModule::Unknown => parse_file_as_program(&fm, syntax, target, comments, &mut errors),
        };

        for e in errors {
            e.into_diagnostic(handler).emit();
            error = true;
        }

        let mut res = program_result.map_err(|e| {
            e.into_diagnostic(handler).emit();
            Error::msg("Syntax Error")
        });

        if error {
            return Err(anyhow::anyhow!("Syntax Error"));
        }

        if env::var("SWC_DEBUG").unwrap_or_default() == "1" {
            res = res.with_context(|| format!("Parser config: {:?}", syntax));
        }

        res
    }

    pub fn new(
        resource_path: PathBuf,
        source: String,
        mut options: Options,
    ) -> Result<Self, Error> {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let globals = Globals::default();
        GLOBALS.set(&globals, || {
            let top_level_mark = Mark::new();
            let unresolved_mark = Mark::new();
            options.top_level_mark = Some(top_level_mark);
            options.unresolved_mark = Some(unresolved_mark);
        });

        let fm = cm.new_source_file(FileName::Real(resource_path), source);
        let comments = SingleThreadedComments::default();
        let config = options.config.clone();

        let helpers = GLOBALS.set(&globals, || {
            let external_helpers = options.config.jsc.external_helpers;
            Helpers::new(external_helpers.into())
        });

        Ok(Self {
            cm,
            fm,
            comments,
            options,
            globals,
            helpers,
            config,
        })
    }

    pub fn run<R>(&self, op: impl FnOnce() -> R) -> R {
        GLOBALS.set(&self.globals, op)
    }

    pub fn parse<'a, P>(
        &'a self,
        program: Option<Program>,
        before_pass: impl FnOnce(&Program) -> P + 'a,
    ) -> Result<BuiltInput<impl Fold + 'a>, Error>
    where
        P: Fold + 'a,
    {
        let built = self.run(|| {
            try_with_handler(self.cm.clone(), Default::default(), |handler| {
                let built = self.options.build_as_input(
                    &self.cm,
                    &self.fm.name,
                    move |syntax, target, is_module| match program {
                        Some(v) => Ok(v),
                        _ => self.parse_js(
                            self.fm.clone(),
                            handler,
                            target,
                            syntax,
                            is_module,
                            Some(&self.comments),
                        ),
                    },
                    self.options.output_path.as_deref(),
                    self.options.source_root.clone(),
                    self.options.source_file_name.clone(),
                    handler,
                    Some(self.config.clone()),
                    Some(&self.comments),
                    before_pass,
                )?;

                Ok(Some(built))
            })
        })?;

        match built {
            Some(v) => Ok(v),
            None => {
                anyhow::bail!("cannot process file because it's ignored by .swcrc")
            }
        }
    }

    pub fn transform(&self, config: BuiltInput<impl Fold>) -> Result<Program, Error> {
        let program = config.program;
        let mut pass = config.pass;

        let program = self.run(|| {
            helpers::HELPERS.set(&self.helpers, || {
                try_with_handler(self.cm.clone(), Default::default(), |handler| {
                    HANDLER.set(handler, || {
                        // Fold module
                        Ok(program.fold_with(&mut pass))
                    })
                })
            })
        });
        if let Some(comments) = &config.comments {
            minify_file_comments(comments, config.preserve_comments);
        };

        program
    }

    pub fn comments(&self) -> &SingleThreadedComments {
        &self.comments
    }

    pub fn options(&self) -> &Options {
        &self.options
    }

    pub fn cm(&self) -> &Arc<SourceMap> {
        &self.cm
    }
}

pub trait IntoJsAst {
    fn into_js_ast(self, program: Program) -> JsAst;
}

impl IntoJsAst for SwcCompiler {
    fn into_js_ast(self, program: Program) -> JsAst {
        JsAst::default()
            .with_program(JsProgram::new(
                program,
                Some(self.comments.into_swc_comments()),
            ))
            .with_context(JsAstContext {
                globals: self.globals,
                helpers: self.helpers,
                source_map: self.cm,
                top_level_mark: self
                    .options
                    .top_level_mark
                    .expect("`top_level_mark` should be initialized"),
                unresolved_mark: self
                    .options
                    .unresolved_mark
                    .expect("`unresolved_mark` should be initialized"),
            })
    }
}

trait IntoSwcComments {
    fn into_swc_comments(self) -> SwcComments;
}

impl IntoSwcComments for SingleThreadedComments {
    fn into_swc_comments(self) -> SwcComments {
        let (l, t) = {
            let (l, t) = self.take_all();
            (l.take(), t.take())
        };
        SwcComments {
            leading: Arc::new(DashMap::from_iter(l)),
            trailing: Arc::new(DashMap::from_iter(t)),
        }
    }
}
