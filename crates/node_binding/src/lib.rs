#![deny(clippy::all)]

use std::collections::HashMap;

use pkg_core::{self, TransformOptions};

#[macro_use]
extern crate napi_derive;

#[napi(object, object_to_js = false)]
pub struct RawTransformOptions {
  pub src_dir: String,
  pub input_files: Vec<String>,
  pub out_dir: String,
  // The syntax target like es5, es2017 and so on. For more detail, see swc_ecma_ast::EsVersion.
  pub target: String,
  // The module like es6, cjs. For more detail, see swc_ecma_transforms::module.
  #[napi(ts_type = "'es6' | 'commonjs'")]
  pub module: String,
  pub sourcemap: bool,
  pub alias_config: HashMap<String, String>,
}

#[napi]
pub async fn transform(raw_options: RawTransformOptions) {
  let RawTransformOptions {
    src_dir,
    out_dir,
    input_files,
    target,
    module,
    alias_config,
    sourcemap,
  } = raw_options;

  let transform_options = TransformOptions {
    src_dir,
    input_files,
    out_dir,
    target,
    module,
    alias_config,
    sourcemap,
  };
  let _ = pkg_core::transform(transform_options).await;
}
