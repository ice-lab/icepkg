#![deny(clippy::all)]
mod napi_env;

use std::{path::{Path, PathBuf}, sync::Arc};
use walkdir::WalkDir;
use std::thread;
use glob_match::glob_match;
use napi::{
  bindgen_prelude::*,
  threadsafe_function::{ThreadsafeFunction, ThreadsafeFunctionCallMode, ThreadSafeCallContext, ErrorStrategy}, JsString, JsNumber, JsObject, NapiRaw,
};
use swc_core::{
  base::config::Options as SwcOptions,
  ecma::{
    ast::EsVersion,
    parser::{Syntax, TsConfig},
  },
};
use swc::Compiler;
use serde_json::to_string;
use napi_env::get_napi_env;

#[macro_use]
extern crate napi_derive;

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

#[tokio::main]
#[napi]
pub async fn do_transform(
  task_config: TaskConfig,
) {
  // 1. get all files in entry_dir
  let files = get_files(&task_config);

  // 2. transform each files
  let transforms = task_config.transforms.unwrap_or(vec![]);

  // let struct = { code, map }
  for transform in transforms.into_iter() {
    call_threadsafe_function(transform);


    // crate::js_fn_into_threadsafe_fn!(transform, &Env::from(String::from("xx")))
  //   // 在这里传入 code 和 map
  //   let code = String::from("code");
  //   println!("a: {}", a);
  }

  for file in files {

  }
}
#[napi(ts_return_type = "Promise<void>")]
pub fn tsfn_async_call(func: JsFunction) -> napi::Result<Object> {
  let env = get_napi_env();
  let env = Env::from(env);
  let tsfn: ThreadsafeFunction<()> =
    func.create_threadsafe_function(0, move |_| Ok(vec![0u32, 1u32, 2u32]))?;

  env.spawn_future(async move {
    let msg: String = tsfn.call_async(Ok(())).await?;
    assert_eq!(msg, "ReturnFromJavaScriptRawCallback".to_owned());
    Ok(())
  })
}

#[napi]
pub fn call_threadsafe_function(callback: JsFunction) -> napi::Result<()> {
  let tsfn: ThreadsafeFunction<TransformInput, ErrorStrategy::Fatal> = callback
    .create_threadsafe_function(0, |ctx: ThreadSafeCallContext<TransformInput>| {
        let mut obj = ctx.env.create_object().unwrap();
        obj.set("test", 1).unwrap();
        Ok(vec![obj])
    })?;
  let env = get_napi_env();
  let env = Env::from(env);
  let tsfn = tsfn.clone();

  env.spawn_future(async move {
    let input = TransformInput {
      id: String::from("id"),
      code: String::from("code"),
      map: String::from("map"),
    };
    let result: String = tsfn.call_async(input).await?;

    Ok(result)
  })?;
  Ok(())
}

struct TransformInput {
  id: String,
  code: String,
  map: String,
}

fn get_files(task_config: &TaskConfig) -> Vec<String> {
  let entry_absolute_path: PathBuf = Path::new(&task_config.root_dir).join(Path::new(&task_config.entry_dir));

  let transform_excludes = task_config.transform_excludes
  .clone()
  .unwrap_or(vec![])
  .iter()
  .map(|exclude| {
    Path::new(&entry_absolute_path).join(Path::new(exclude)).to_str().unwrap().to_string()
  })
  .collect::<Vec<_>>();

  let files = WalkDir::new(&entry_absolute_path)
    .into_iter()
    .filter_map(|e| e.ok())
    .filter(|e| e.file_type().is_file())
    .map(|e| e.path().to_str().unwrap().to_string())
    .filter(|p| !transform_excludes.iter().any(|exclude| glob_match(exclude, p)))
    .collect::<Vec<_>>();

  files
}

fn get_swc_config(
  file: PathBuf,
  es_target: EsVersion,
) -> SwcOptions {
  let mut swc_options = SwcOptions {
    ..Default::default()
  };
  swc_options.config.jsc.target = Some(es_target);
  let file_extension = file.extension().unwrap();
  let ts_extensions = vec!["ts", "tsx", "mts"];
  if ts_extensions.iter().any(|ext| ext == &file_extension) {
    swc_options.config.jsc.syntax = Some(Syntax::Typescript(TsConfig {
      tsx: true,
      decorators: true,
      ..Default::default()
    }))
  }
  swc_options
}

async fn swc_transform(transform_input: &TransformInput) {
  // let swc_options = get_swc_config(
  //   PathBuf::new().join(&transform_input.id),
  //   EsVersion::Es2017, // TODO: get esVersion from task_config
  // );

  // let c = Compiler::new(swc_options);
}
