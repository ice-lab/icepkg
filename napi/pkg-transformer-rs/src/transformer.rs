use std::{path};
use walkdir::WalkDir;
use std::thread;
use glob_match::glob_match;
use napi::{
  bindgen_prelude::*,
  threadsafe_function::{ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode},
};

#[napi(object)]
pub struct TaskConfig {
  pub root_dir: String,
  // entry directory. default is `./src`
  pub entry_dir: String,
  // output directory
  pub output_dir: String,
  // development or production
  pub mode: String,
  // es2017 / esm / cjs
  pub task_name: String,
  // files should be excluded relative to the entry_dir,
  pub transform_excludes: Option<Vec<String>>,

  pub transforms: Option<Vec<JsFunction>>,
}

struct TransformResult {
  code: String,
  map: Option<String>,
}

// type Transform =  Fn(&str, &str) -> Option<TransformResult>;

#[napi]
pub fn run_transform(
  task_config: TaskConfig,
) {
  // 1. get all files in entry_dir
  let entry_absolute_path = path::Path::new(&task_config.root_dir).join(path::Path::new(&task_config.entry_dir));
  let transform_excludes = task_config.transform_excludes
  .unwrap_or(vec![])
  .iter()
  .map(|exclude| {
    path::Path::new(&entry_absolute_path).join(path::Path::new(exclude)).to_str().unwrap().to_string()
  })
  .collect::<Vec<_>>();

  let files = WalkDir::new(&entry_absolute_path)
    .into_iter()
    .filter_map(|e| e.ok())
    .filter(|e| e.file_type().is_file())
    .map(|e| e.path().to_str().unwrap().to_string())
    .filter(|p| !transform_excludes.iter().any(|exclude| glob_match(exclude, p)))
    .collect::<Vec<_>>();

  // 2. transform each files
  let transforms = task_config.transforms.unwrap_or(vec![]);
  for transform in transforms.into_iter() {
    call_threadsafe_function(transform).unwrap();
  }
}

#[napi]
fn call_threadsafe_function(callback: JsFunction) -> Result<()> {
  let transform_input: TransformInput = TransformInput {
    code: "code".to_string(),
    map: "map".to_string(),
  };

  let tsfn: ThreadsafeFunction<TransformInput, ErrorStrategy::CalleeHandled> = callback
    .create_threadsafe_function(0, |ctx| {
      // ctx.env(ctx.value + 1).map(|v| vec![v])
      // println!()
      ctx.env.create_string("hello".as_ref()).map(|v| vec![v])
    })?;

  let tsfn = tsfn.clone();
  thread::spawn(move || {
    tsfn.call(Ok(transform_input), ThreadsafeFunctionCallMode::Blocking)
  });

  Ok(())
}

struct TransformInput {
  code: String,
  map: String,
}
