mod swc_compiler;

use std::path::PathBuf;
use swc_compiler::SwcCompiler;
use swc_core::{
  base::config::Options as SwcOptions,
  ecma::{
    ast::EsVersion,
    parser::{Syntax, TsConfig},
  },
};
// mod transform;

pub fn get_swc_config(file: PathBuf, es_target: EsVersion) -> SwcOptions {
  let mut swc_options = SwcOptions {
    ..Default::default()
  };
  swc_options.config.jsc.target = Some(es_target);
  let file_extension = file.extension().unwrap();
  let ts_extensions = ["ts", "tsx", "mts"];
  if ts_extensions.iter().any(|ext| ext == &file_extension) {
    swc_options.config.jsc.syntax = Some(Syntax::Typescript(TsConfig {
      tsx: true,
      decorators: true,
      ..Default::default()
    }))
  }
  swc_options
}

#[cfg(test)]
mod tests {
  // use self::transform::transform;

  use super::*;
  use anyhow::{Error, Result};

  #[test]
  fn test_get_swc_config() {
    let file = PathBuf::from("test.ts");
    let es_target = EsVersion::Es2017;

    let swc_options = get_swc_config(file, es_target);

    assert_eq!(swc_options.config.jsc.target, Some(EsVersion::Es2017));
    assert_eq!(
      swc_options.config.jsc.syntax,
      Some(Syntax::Typescript(TsConfig {
        tsx: true,
        decorators: true,
        ..Default::default()
      }))
    );
  }

  fn compile_ts_file() -> Result<()> {
    let source_path = PathBuf::from("test.ts");
    let source_content = "interface Person { name: string; age: number }; const person: Person = { name: 'Mike', age: 8, };".to_string();
    let es_target = EsVersion::Es2017;

    let swc_options = get_swc_config(source_path.clone(), es_target);

    let compiler =
      SwcCompiler::new(source_path, source_content, swc_options).map_err(Error::from)?;
    // let built = compiler
    //   .parse(None, |_| {
    //     // transform(
    //     //   resource_path,
    //     //   rspack_options,
    //     //   comments,
    //     //   top_level_mark,
    //     //   unresolved_mark,
    //     //   cm,
    //     //   content,
    //     //   rspack_experiments,
    //     // )
    //   })
    //   .map_err(Error::from)?;
    Ok(())
  }
}
