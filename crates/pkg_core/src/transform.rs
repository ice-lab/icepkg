use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Ok, Result};
use futures::future::join_all;
use pkg_loader::{Loader, LoaderArgs};
use pkg_loader_alias::LoaderAlias;
use pkg_loader_swc::LoaderSWC;
use tokio::{fs, spawn};

pub struct TransformOptions {
    pub src_dir: String,
    // the file paths are relative to the src_dir
    pub input_files: Vec<String>,
    pub out_dir: String,
    pub target: String,
    pub module: String,
}

type BoxLoader = Box<dyn Loader>;

fn create_loader() -> Vec<BoxLoader> {
    vec![
        // builtin loaders
        Box::new(LoaderAlias),
        Box::new(LoaderSWC),
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
    let TransformOptions { target, module, .. } = options;
    let target = Arc::new(target);
    let module = Arc::new(module);

    // 1. run loaders to transform files
    let loader_jobs = options.input_files.into_iter().map(|input_file| {
        let target = target.clone();
        let module = module.clone();

        let file_path = PathBuf::from(&options.src_dir).join(&input_file);
        let out_file_path = get_output_file_path(&input_file, &options.out_dir);

        spawn(async move {
            let file_path = file_path.to_str().expect("");
            let mut code = fs::read_to_string(file_path).await?;
            let mut sourcemap = None;
            for loader in create_loader() {
                let loader_args = LoaderArgs {
                    id: file_path,
                    code: &code,
                    target: &target,
                    module: &module,
                };
                if let Some(output) = loader.run(&loader_args).await? {
                    code = output.code;

                    if output.map.is_some() {
                        sourcemap = output.map;
                    }
                }
            }
            Ok(OutputFile {
                path: out_file_path,
                code,
                sourcemap,
            })
        })
    });

    let outputs = join_all(loader_jobs).await;

    let mut write_file_jobs = vec![];

    // 2. write outputs
    for output in outputs {
        let output = output
            .expect("get output file error")
            .expect("get output file error");
        write_file_jobs.push(fs::write(output.path.clone(), output.code));
        if let Some(sourcemap) = output.sourcemap {
            let source_map_path = Path::new(&output.path.clone()).join(".map");
            write_file_jobs.push(fs::write(source_map_path, sourcemap));
        }
    }

    join_all(write_file_jobs).await;

    Ok(())
}

fn get_output_file_path(input_file: &str, out_dir: &str) -> PathBuf {
    let output_file_path = PathBuf::from(out_dir).join(input_file);
    let ext = output_file_path.extension().unwrap();

    if ext == "ts" {
        output_file_path.with_extension("js")
    } else if ext == "mts" {
        output_file_path.with_extension("mjs")
    } else if ext == "cts" {
        output_file_path.with_extension("cjs")
    } else {
        output_file_path
    }
}
