use anyhow::{Ok, Result};
use futures::future::join_all;
use glob::glob;
use pkg_loader::{Loader, LoaderArgs};
use pkg_loader_alias::LoaderAlias;
use pkg_loader_swc::LoaderSWC;
use tokio::{fs, spawn};

pub struct TransformOptions {
    pub src_dir: String,
    pub out_dir: String,
    pub clean: bool,
    // ignore_patterns: Option<Vec<String>>,
}

type BoxLoader = Box<dyn Loader>;

fn create_loader() -> Vec<BoxLoader> {
    vec![
        // builtin alias loader
        Box::new(LoaderAlias),
        Box::new(LoaderSWC),
    ]
}

pub async fn transform(options: TransformOptions) -> Result<()> {
    // Setup output directory
    if options.clean {
        if tokio::fs::try_exists(&options.out_dir).await.unwrap() {
            fs::remove_dir_all(&options.out_dir).await?;
        }
        fs::create_dir_all(&options.out_dir).await?;
    }
    // scan input files
    let file_paths = glob(format!("{}/**/*.*", options.src_dir).as_str())?
        .filter_map(Result::ok)
        .collect::<Vec<_>>();
    println!("file_paths: {:?}", file_paths);
    // run loaders to transform files
    let jobs = file_paths.into_iter().map(|file_path| {
        // let out_file_path = format!("{}/{}", options.out_dir, file_name);

        spawn(async move {
            let file_path = file_path.to_str().expect("");
            let mut code = fs::read_to_string(file_path).await?;
            for loader in create_loader() {
                if let Some(output) = loader
                    .run(&LoaderArgs {
                        id: file_path,
                        code: &code,
                    })
                    .await?
                {
                    code = output.code;

                    // TODO: sourcemap
                }
            }
            Ok((code))
        })
    });

    let output = join_all(jobs).await;

    // write outputs

    Ok(())
}
