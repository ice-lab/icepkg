#![deny(clippy::all)]

use glob_match::glob_match;
use napi::{bindgen_prelude::*, threadsafe_function::ThreadsafeFunction, CallContext};
use path_absolutize::*;
use remove_dir_all::remove_dir_all;
use std::{
  path::{Path, PathBuf},
  result,
  sync::Arc,
};
use walkdir::WalkDir;
mod ast;
mod plugin_swc;

#[macro_use]
extern crate napi_derive;

#[derive(Clone, Debug)]
#[napi(object)]
pub struct TransformInput {
  pub id: String,
  pub code: String,
  pub map: Option<String>,
}

#[napi(object)]
pub struct TransformResult {
  pub code: String,
  pub map: Option<String>,
}

// #[napi(object, object_to_js = false)]
// pub struct TaskConfig {
//   pub root_dir: String,
//   // entry directory. default is `./src`
//   pub entry_dir: String,
//   // output directory
//   pub output_dir: String,
//   // development or production
//   pub mode: String,
//   // es2017 / esm / cjs
//   pub task_name: String,
//   // files should be excluded relative to the entry_dir,
//   pub transform_excludes: Option<Vec<String>>,
//   #[napi(ts_return_type = "Array<() => <Promise<string>>")]
//   pub transforms: Option<Vec<ThreadsafeFunction<TransformInput>>>,
// }

// #[napi]
// pub async fn do_transform(task_config: TaskConfig) {
//   // 1. get all files in entry_dir
//   let all_files = get_files(&task_config);

//   // 2. transform each files
//   let transform_funcs = task_config.transforms.unwrap_or_default();

//   for file in all_files {
//     let transform_funcs = transform_funcs.clone();

//     tokio::spawn(async move {
//       let file_content = tokio::fs::read_to_string(&file).await.unwrap();
//       let mut transform_input = TransformInput {
//         id: file.clone(),
//         code: file_content,
//         map: None,
//       };
//       for transform_func in transform_funcs.iter() {
//         let TransformResult { code, map } = transform_func
//           .call_async::<Promise<TransformResult>>(Ok(transform_input.clone()))
//           .await
//           .unwrap()
//           .await
//           .unwrap();
//         transform_input.code = code;
//         transform_input.map = map;
//       }

//       println!("transform_input: {:?}", transform_input);
//     });
//   }
// }

// #[napi]
// pub async fn transform(
//   id: String,
//   code: String,
//   map: Option<String>,
//   loader: ThreadsafeFunction<TransformInput>,
// ) -> Result<TransformResult> {
//   let transform_input = TransformInput { id, code, map };
//   let TransformResult { code, map } = loader
//     .call_async::<Promise<TransformResult>>(Ok(transform_input))
//     .await?
//     .await?;
//   println!("code: {}", code);
//   println!("map: {:?}", map.clone());
//   Ok(TransformResult { code, map })
// }

// fn get_files(task_config: &TaskConfig) -> Vec<String> {
//   let entry_absolute_path: PathBuf =
//     Path::new(&task_config.root_dir).join(Path::new(&task_config.entry_dir));

//   let transform_excludes = task_config
//     .transform_excludes
//     .clone()
//     .unwrap_or_default()
//     .iter()
//     .map(|exclude| {
//       Path::new(&entry_absolute_path)
//         .join(Path::new(exclude))
//         .to_str()
//         .unwrap()
//         .to_string()
//     })
//     .collect::<Vec<_>>();

//   let files = WalkDir::new(&entry_absolute_path)
//     .into_iter()
//     .filter_map(|e| e.ok())
//     .filter(|e| e.file_type().is_file())
//     .map(|e| e.path().to_str().unwrap().to_string())
//     .filter(|p| {
//       !transform_excludes
//         .iter()
//         .any(|exclude| glob_match(exclude, p))
//     })
//     .collect::<Vec<_>>();

//   files
// }

#[napi(object, object_to_js = false)]
pub struct TaskConfig {
  pub root_dir: String,
  // entry directory. default is `./src`
  pub entry_dir: String,
  // es2017 / esm / cjs
  pub targets: Vec<String>,
  // files should be excluded relative to the entry_dir. Support glob pattern.
  pub transform_excludes: Option<Vec<String>>,
}

fn get_all_files(task_config: &TaskConfig) -> (Vec<String>, Vec<String>) {
  // TODO:
  let entry_absolute_path: PathBuf =
    Path::new(&task_config.root_dir).join(Path::new(&task_config.entry_dir));

  // transform to absolute path
  let transform_excludes = task_config
    .transform_excludes
    .clone()
    .unwrap_or_default()
    .iter()
    .map(|exclude| {
      Path::new(&entry_absolute_path)
        .join(Path::new(exclude))
        .to_str()
        .unwrap()
        .to_string()
    })
    .collect::<Vec<_>>();

  let files = WalkDir::new(&entry_absolute_path)
    .into_iter()
    .filter_map(|e| e.ok())
    .filter(|e| e.file_type().is_file())
    .map(|e| e.path().to_str().unwrap().to_string())
    .filter(|p| {
      !transform_excludes
        .iter()
        .any(|exclude| glob_match(exclude, p))
    })
    .collect::<Vec<_>>();

  // files
  (vec![], vec![])
}

pub async fn run_transform_tasks(task_config: TaskConfig) {
  for target in &task_config.targets {
    let entry_dir = Path::new(&task_config.root_dir)
      .join(&task_config.entry_dir)
      .to_string_lossy()
      .to_string();
    let output_dir = Path::new(&task_config.root_dir.clone())
      .join(target)
      .to_string_lossy()
      .to_string();
    let transform_excludes = task_config.transform_excludes.clone().unwrap_or_default();
    // let include_files = get_files1(&task_config);
    // let exclude_files = transform_excludes
    //   .iter()
    //   .map(|exclude| {
    //     Path::new(&entry_dir)
    //       .join(Path::new(exclude))
    //       .to_str()
    //       .unwrap()
    //       .to_string()
    //   })
    //   .collect::<Vec<_>>();

    let (include_files, exclude_files) = get_all_files(&task_config);
    let result = run_transform_task(
      Command::Build,
      entry_dir,
      output_dir,
      include_files,
      exclude_files,
    )
    .await;
  }
}

enum Command {
  Build,
  Start,
}

async fn run_transform_task(
  command: Command,
  entry_dir: String,
  output_dir: String,
  include_files: Vec<String>,
  exclude_files: Vec<String>,
) -> Result<()> {
  let entry_dir = Arc::new(entry_dir);
  let output_dir = Arc::new(output_dir);

  let is_output_dir_exists = tokio::fs::try_exists(Path::new(output_dir.as_str()))
    .await
    .unwrap();

  if let Command::Build = command {
    if is_output_dir_exists {
      remove_dir_all(Path::new(output_dir.as_str())).expect("remove output dir failed");
    }
    tokio::fs::create_dir(Path::new(output_dir.as_str()))
      .await
      .unwrap();
  } else if !is_output_dir_exists {
    tokio::fs::create_dir(Path::new(output_dir.as_str()))
      .await
      .unwrap();
  }

  let mut tasks = vec![];

  // compile module
  for file in include_files {
    let entry_dir_clone = entry_dir.clone();
    let output_dir_clone = output_dir.clone();
    let task = tokio::spawn(async move {
      let file_content = tokio::fs::read_to_string(Path::new(entry_dir_clone.as_str()).join(&file))
        .await
        .unwrap();
      // TODO: Run Loaders
      tokio::fs::write(
        Path::new(output_dir_clone.as_str()).join(&file),
        file_content,
      )
      .await
      .unwrap();
    });
    tasks.push(task);
  }

  // copy exclude files to the output directory
  for file in exclude_files {
    let entry_dir_clone = entry_dir.clone();
    let output_dir_clone = output_dir.clone();
    let task = tokio::spawn(async move {
      tokio::fs::copy(
        Path::new(entry_dir_clone.as_str()).join(&file),
        Path::new(output_dir_clone.as_str()).join(&file),
      )
      .await
      .unwrap();
    });
    tasks.push(task);
  }

  let results = futures::future::join_all(tasks).await;

  // TODO: prettier print
  println!("transform task all done");

  // match result {
  //   Ok(_) => Ok(()),
  //   Err(e) => Ok(()),
  // }
  Ok(())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[tokio::test]
  async fn test_run_transform_task() {
    let _ = run_transform_task(
      Command::Build,
      // TODO: use the local directory instead
      "/Users/luhc228/workspace/github/icepkg/napi/pkg-transformer-rs/demo/src".to_string(),
      "/Users/luhc228/workspace/github/icepkg/napi/pkg-transformer-rs/demo/esm".to_string(),
      vec!["index.tsx".to_string()],
      vec!["index.css".to_string()],
    )
    .await;
  }

  #[tokio::test]
  async fn test_run_transform_tasks() {
    run_transform_tasks(TaskConfig {
      root_dir: "/Users/luhc228/workspace/github/icepkg/napi/pkg-transformer-rs/demo".to_string(),
      entry_dir: "src".to_string(),
      targets: vec!["es2017".to_string(), "esm".to_string()],
      transform_excludes: Some(vec![]),
    })
    .await;
  }
}
