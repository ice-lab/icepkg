mod ast;
mod compiler;
mod transformer;

use std::path::{Path, PathBuf};

use compiler::{IntoJsAst, SwcCompiler};
use pkg_loader::{Loader, LoaderArgs, LoaderOutput, LoaderReturn};
use swc_core::base::config::{Options, OutputCharset};
use swc_core::base::TransformOutput;
use swc_core::ecma::ast::EsVersion;
use swc_core::ecma::parser::{Syntax, TsConfig};
use swc_core::ecma::visit::Fold;

#[derive(Debug)]
pub struct LoaderSWC;

#[async_trait::async_trait]
impl Loader for LoaderSWC {
    fn name(&self) -> &'static str {
        "builtin-loader-swc"
    }

    async fn run(&self, input: &LoaderArgs) -> LoaderReturn {
        println!("LoaderSWC::run: id: {}, code: {}", input.id, input.code);
        let file_path = PathBuf::from(input.id);
        let content = input.code;

        // 1. handle swc_options
        let mut swc_options = Options {
            ..Default::default()
        };
        // TODO: update the es version by the config
        swc_options.config.jsc.target = Some(EsVersion::Es5);
        let file_extension = file_path.extension().unwrap();
        let ts_extensions = ["tsx", "ts", "mts"];
        if ts_extensions.iter().any(|ext| ext == &file_extension) {
            swc_options.config.jsc.syntax = Some(Syntax::Typescript(TsConfig {
                tsx: true,
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
        let codegen_options = ast::CodegenOptions {
            target: Some(built.target),
            minify: Some(built.minify),
            ascii_only: built
                .output
                .charset
                .as_ref()
                .map(|v| matches!(v, OutputCharset::Ascii)),
            source_map_config: ast::SourceMapConfig {
                enable: false,
                inline_sources_content: false,
                emit_columns: false,
                names: Default::default(),
            },
            inline_script: Some(false),
            keep_comments: Some(true),
        };
        let program = c.transform(built).map_err(anyhow::Error::from)?;
        let ast = c.into_js_ast(program);
        let TransformOutput { code, map } = ast::stringify(&ast, codegen_options)?;
        println!("LoaderSWC::run: code: {}", code);

        Ok(None)
    }
}

fn optimize() -> impl Fold {
    Optimize {}
}

struct Optimize {}

impl Fold for Optimize {
    // fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
    //     module
    // }
}
