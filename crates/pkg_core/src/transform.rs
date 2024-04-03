use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Ok, Result};
use futures::future::join_all;
use normalize_path::NormalizePath;
use pkg_loader::{GenerateOutput, Loader, TransformTaskOptions};
use swc_compiler::compiler::{IntoJsAst, SwcCompiler};
use swc_core::ecma::parser::{EsConfig, Syntax, TsConfig};
use swc_core::{
    base::config::{ModuleConfig, Options, OutputCharset},
    ecma::visit::Fold,
};
use swc_core::{base::TransformOutput, ecma::ast::EsVersion};
use swc_ecma_transforms::modules::{common_js::Config as CommonJsConfig, EsModuleConfig};
use tokio::{fs, spawn};

use pkg_loader_alias::LoaderAlias;
// use pkg_loader_swc::LoaderSWC;

pub struct TransformOptions {
    pub src_dir: String,
    // the file paths are relative to the src_dir
    pub input_files: Vec<String>,
    pub out_dir: String,
    pub target: String,
    pub module: String,
    pub sourcemap: bool,
    pub alias_config: HashMap<String, String>,
}

type BoxLoader = Box<dyn Loader>;

fn create_loader() -> Vec<BoxLoader> {
    vec![
        // builtin loaders
        Box::new(LoaderAlias),
    ]
}

struct OutputFile {
    pub path: PathBuf,
    pub code: String,
    pub sourcemap: Option<String>,
}

/**
 * File to file compile transformer.
 */
pub async fn transform(options: TransformOptions) -> Result<()> {
    let TransformOptions {
        target,
        module,
        alias_config,
        ..
    } = options;
    let target = Arc::new(target);
    let module = Arc::new(module);
    let alias_config = Arc::new(alias_config);

    // 1. run loaders to transform files
    let loader_runner_jobs = options.input_files.into_iter().map(|input_file| {
        let target = target.clone();
        let module = module.clone();
        let alias_config = alias_config.clone();

        let file_path = PathBuf::from(&options.src_dir)
            .join(&input_file)
            .normalize();
        let out_file_path = get_output_file_path(&input_file, &options.out_dir);

        spawn(async move {
            let transform_task_options = TransformTaskOptions {
                target: &target,
                module: &module,
                alias_config: &alias_config,
            };
            let id = file_path.to_string_lossy().into_owned();

            let original_code = fs::read_to_string(&id).await?;
            let (original_ast, codegen_options) =
                get_ast(&id, &original_code, &target, &module).expect("Failed to get ast.");

            let mut cur_code = original_code.clone();
            let mut cur_sourcemap = None;
            let mut cur_ast = original_ast;
            let mut is_called_generate_method_last_time = false;

            for loader in create_loader() {
                let can_reuse_ast = loader.can_reuse_ast();
                if can_reuse_ast {
                    // call transform function to get the latest ast
                    if !is_called_generate_method_last_time {
                        loader
                            .transform(&id, &mut cur_ast, &transform_task_options)
                            .await;
                    } else {
                        // parse it again to get the latest ast
                        let (mut new_ast, _codegen_options) =
                            get_ast(&id, &cur_code, &target, &module)
                                .expect("failed to get ast in the loader runner.");
                        loader
                            .transform(&id, &mut new_ast, &transform_task_options)
                            .await;
                    }
                    is_called_generate_method_last_time = false;
                } else {
                    // call generate function to get the code and sourcemap
                    let code: String;
                    let map: Option<String>;
                    if !is_called_generate_method_last_time {
                        // Get the latest code and map from the latest ast
                        let transform_output =
                            swc_compiler::ast::stringify(&cur_ast, codegen_options.clone())?;
                        code = transform_output.code;
                        map = transform_output.map;
                    } else {
                        code = cur_code.clone();
                        map = cur_sourcemap.clone();
                    }

                    if let Some(GenerateOutput {
                        code: new_code,
                        map: new_map,
                    }) = loader
                        .generate(&id, code, map, &transform_task_options)
                        .await?
                    {
                        cur_code = new_code;
                        if new_map.is_some() {
                            cur_sourcemap = new_map;
                        }
                    }

                    is_called_generate_method_last_time = true;
                }
            }

            if !is_called_generate_method_last_time {
                let TransformOutput {
                    code: new_code,
                    map: new_map,
                } = swc_compiler::ast::stringify(&cur_ast, codegen_options.clone())?;
                cur_code = new_code;
                if new_map.is_some() {
                    cur_sourcemap = new_map;
                }
            }

            Ok(OutputFile {
                path: out_file_path,
                code: cur_code,
                sourcemap: cur_sourcemap,
            })
        })
    });

    let outputs = join_all(loader_runner_jobs).await;

    let mut write_file_jobs = vec![];

    // 2. write outputs
    for output in outputs {
        // FIXME: 如果父目录不存在，生成会失败
        let output = output
            .expect("get output file error")
            .expect("get output file error");

        if let Some(sourcemap) = output.sourcemap {
            let source_map_path = output.path.to_string_lossy().to_string() + ".map";
            let source_map_path = PathBuf::from(source_map_path);
            write_file_jobs.push(fs::write(source_map_path.clone(), sourcemap));
        }
        // FIXME: 需要额外加 //# sourceMappingURL=<index.js>.map
        write_file_jobs.push(fs::write(output.path.clone(), output.code));
    }

    join_all(write_file_jobs).await;

    Ok(())
}

fn get_ast(
    id: &str,
    code: &str,
    target: &str,
    module: &str,
) -> Result<(
    swc_compiler::ast::javascript::Ast,
    swc_compiler::ast::CodegenOptions,
)> {
    let file_path = PathBuf::from(id);

    // 1. handle swc_options
    let mut swc_options = Options {
        ..Default::default()
    };
    swc_options.config.jsc.target = Some(match target {
        "es3" => EsVersion::Es3,
        "es5" => EsVersion::Es5,
        "es2015" => EsVersion::Es2015,
        "es2016" => EsVersion::Es2016,
        "es2017" => EsVersion::Es2017,
        "es2018" => EsVersion::Es2018,
        "es2019" => EsVersion::Es2019,
        "es2020" => EsVersion::Es2020,
        "es2021" => EsVersion::Es2021,
        "es2022" => EsVersion::Es2022,
        "esnext" => EsVersion::EsNext,
        _ => panic!("unknown target {}. Available target are: es3, es5, es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, esnext", target),
    });
    swc_options.config.module = Some(match module {
        "es6" => ModuleConfig::Es6(EsModuleConfig {
            ..Default::default()
        }),
        "commonjs" => ModuleConfig::CommonJs(CommonJsConfig {
            ..Default::default()
        }),
        _ => panic!(
            "unknown module {}. Now only support es6 and commonjs.",
            module
        ),
    });
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
    let c = SwcCompiler::new(file_path.clone(), code.to_owned(), swc_options)
        .map_err(anyhow::Error::from)?;
    let built = c
        .parse(None, |_| {
            // TODO: Need to remove it in the future when it doesn't need.
            mock_before_pass_transform()
        })
        .map_err(anyhow::Error::from)?;

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
            inline_sources_content: true,
            emit_columns: false,
            names: Default::default(),
        },
        inline_script: Some(false),
        keep_comments: Some(true),
    };

    // 3. generate code
    let program = c.transform(built).map_err(anyhow::Error::from)?;
    let ast = c.into_js_ast(program);
    Ok((ast, codegen_options))
}

struct MockBeforePassTransform;

impl Fold for MockBeforePassTransform {}

fn mock_before_pass_transform() -> impl Fold {
    MockBeforePassTransform {}
}

fn get_output_file_path(input_file: &str, out_dir: &str) -> PathBuf {
    let output_file_path = Path::new(out_dir).join(input_file).normalize();
    let ext = output_file_path.extension().unwrap();

    if ext == "ts" {
        output_file_path.with_extension("js")
    } else if ext == "mts" {
        output_file_path.with_extension("mjs")
    } else if ext == "cts" {
        output_file_path.with_extension("cjs")
    } else {
        // .js / .cjs / .mjs, don't need to replace file extension
        output_file_path
    }
}
