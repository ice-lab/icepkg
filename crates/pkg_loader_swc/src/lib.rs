mod transformer;

use std::path::PathBuf;

use pkg_loader::{Loader, LoaderArgs, LoaderOutput, LoaderReturn};
use swc_compiler::compiler::{IntoJsAst, SwcCompiler};
use swc_core::base::config::{ModuleConfig, Options, OutputCharset};
use swc_core::base::TransformOutput;
use swc_core::ecma::ast::{op, EsVersion};
use swc_core::ecma::parser::{EsConfig, Syntax, TsConfig};
use swc_core::ecma::visit::{as_folder, VisitMut, VisitMutWith};

#[derive(Debug)]
pub struct LoaderSWC;

#[async_trait::async_trait]
impl Loader for LoaderSWC {
    fn name(&self) -> &'static str {
        "builtin-loader-swc"
    }

    async fn run(&self, input: &LoaderArgs) -> LoaderReturn {
        let file_path = PathBuf::from(input.id);
        let content = input.code;

        // 1. handle swc_options
        let mut swc_options = Options {
            ..Default::default()
        };
        // TODO: update the es version by the config
        swc_options.config.jsc.target = Some(EsVersion::Es5);
        swc_options.config.module = Some(ModuleConfig::CommonJs(
            swc_ecma_transforms::modules::common_js::Config {
                ..Default::default()
            },
        ));
        let file_extension = file_path.extension().unwrap();
        let ts_extensions = ["tsx", "ts", "mts"];
        if ts_extensions.iter().any(|ext| ext == &file_extension) {
            swc_options.config.jsc.syntax = Some(Syntax::Typescript(TsConfig {
                tsx: true,
                decorators: true,
                ..Default::default()
            }));
        } else {
            swc_options.config.jsc.syntax = Some(Syntax::Es(EsConfig {
                jsx: true,
                decorators: true,
                ..Default::default()
            }));
        }
        // 2. create swc compiler
        let c = SwcCompiler::new(file_path.clone(), content.to_owned(), swc_options)
            .map_err(anyhow::Error::from)?;
        let built = c
            .parse(None, |_| {
                // TODO: 把 alias_config 传入
                let mut alias_config = serde_json::Map::new();
                alias_config.insert("@".to_string(), "./src".into());
                transformer::alias::alias_transform(alias_config)
            })
            .map_err(anyhow::Error::from)?;
        // 3. generate code
        let codegen_options = swc_compiler::ast::CodegenOptions {
            target: Some(built.target),
            minify: Some(built.minify),
            ascii_only: built
                .output
                .charset
                .as_ref()
                .map(|v| matches!(v, OutputCharset::Ascii)),
            source_map_config: swc_compiler::ast::SourceMapConfig {
                enable: true,
                inline_sources_content: false,
                emit_columns: false,
                names: Default::default(),
            },
            inline_script: Some(false),
            keep_comments: Some(true),
        };
        let program = c.transform(built).map_err(anyhow::Error::from)?;
        let mut ast = c.into_js_ast(program);
        // TODO: we need to support modify the ast
        ast.program.fold_with(&mut as_folder(TransformVisitor));

        let TransformOutput { code, map } = swc_compiler::ast::stringify(&ast, codegen_options)?;

        Ok(Some(LoaderOutput { code, map }))
    }
}

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html

    fn visit_mut_bin_expr(&mut self, e: &mut swc_core::ecma::ast::BinExpr) {
        e.visit_mut_children_with(self);

        if e.op == op!("===") {
            e.op = op!("==");
        }
    }
}
