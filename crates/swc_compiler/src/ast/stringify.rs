use std::sync::Arc;

use super::javascript::Ast;
use anyhow::Result;
use swc_core::{
    atoms::Atom,
    base::{config::JsMinifyFormatOptions, TransformOutput},
    common::{
        collections::AHashMap, comments::Comments, source_map::SourceMapGenConfig, BytePos,
        FileName, SourceMap,
    },
    ecma::{
        ast::{EsVersion, Program as SwcProgram},
        codegen::{
            self,
            text_writer::{self, WriteJs},
            Emitter, Node,
        },
    },
};

#[derive(Default, Clone)]
pub struct CodegenOptions {
    pub target: Option<EsVersion>,
    pub source_map_config: SourceMapConfig,
    pub keep_comments: Option<bool>,
    pub minify: Option<bool>,
    pub ascii_only: Option<bool>,
    pub inline_script: Option<bool>,
}

#[derive(Default, Clone)]
pub struct SourceMapConfig {
    pub enable: bool,
    pub inline_sources_content: bool,
    pub emit_columns: bool,
    pub names: AHashMap<BytePos, Atom>,
}
impl SourceMapGenConfig for SourceMapConfig {
    fn file_name_to_source(&self, f: &FileName) -> String {
        let f = f.to_string();
        if f.starts_with('<') && f.ends_with('>') {
            f[1..f.len() - 1].to_string()
        } else {
            f
        }
    }
}
pub fn stringify(ast: &Ast, options: CodegenOptions) -> Result<TransformOutput> {
    ast.visit(|program, context| {
        let keep_comments = options.keep_comments;
        let target = options.target.unwrap_or(EsVersion::latest());
        let source_map_kinds = options.source_map_config;
        let minify = options.minify.unwrap_or_default();
        let format_opt = JsMinifyFormatOptions {
            inline_script: options.inline_script.unwrap_or(true),
            ascii_only: options.ascii_only.unwrap_or_default(),
            ..Default::default()
        };
        print(
            program.get_inner_program(),
            context.source_map.clone(),
            target,
            source_map_kinds,
            minify,
            keep_comments
                .unwrap_or_default()
                .then(|| program.comments.as_ref().map(|c| c as &dyn Comments))
                .flatten(),
            &format_opt,
        )
    })
}

pub fn print(
    node: &SwcProgram,
    source_map: Arc<SourceMap>,
    target: EsVersion,
    source_map_config: SourceMapConfig,
    minify: bool,
    comments: Option<&dyn Comments>,
    format: &JsMinifyFormatOptions,
) -> Result<TransformOutput> {
    let mut src_map_buf = vec![];

    let src = {
        let mut buf = vec![];
        {
            let mut wr = Box::new(text_writer::JsWriter::new(
                source_map.clone(),
                "\n",
                &mut buf,
                if source_map_config.enable {
                    Some(&mut src_map_buf)
                } else {
                    None
                },
            )) as Box<dyn WriteJs>;

            if minify {
                wr = Box::new(text_writer::omit_trailing_semi(wr));
            }

            let mut emitter = Emitter {
                cfg: codegen::Config::default()
                    .with_minify(minify)
                    .with_target(target)
                    .with_ascii_only(format.ascii_only)
                    .with_inline_script(format.inline_script),
                comments,
                cm: source_map.clone(),
                wr,
            };
            // TODO: Handle diagnostics
            // node.emit_with(&mut emitter).into_diagnostic()?;
            let _ = node.emit_with(&mut emitter);
        }
        // SAFETY: SWC will emit valid utf8 for sure
        unsafe { String::from_utf8_unchecked(buf) }
    };

    let map = if source_map_config.enable {
        let mut buf = vec![];

        source_map
            .build_source_map_with_config(&src_map_buf, None, source_map_config)
            .to_writer(&mut buf)
            .unwrap_or_else(|e| panic!("{}", e.to_string()));
        // SAFETY: This buffer is already sanitized
        Some(unsafe { String::from_utf8_unchecked(buf) })
    } else {
        None
    };
    Ok(TransformOutput { code: src, map })
}