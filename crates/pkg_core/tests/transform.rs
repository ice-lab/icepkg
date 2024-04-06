use glob::glob;
use pkg_core::{transform, TransformOptions};
use std::fs;

#[cfg(test)]
mod test {
    use super::*;
    use std::collections::HashMap;

    #[tokio::test]
    async fn basic_fixtures() {
        let parent_path = fs::canonicalize("./tests/fixtures/basic").unwrap();
        let src_dir = format!("{}/src", parent_path.to_str().unwrap());
        let out_dir = format!("{}/out", parent_path.to_str().unwrap());

        let mut alias_config = HashMap::new();
        alias_config.insert("@".to_string(), "./src".to_string());

        let options = TransformOptions {
            src_dir,
            out_dir,
            input_files: vec!["./a.ts".to_string()],
            target: "es5".to_string(),
            module: "es6".to_string(),
            alias_config,
            sourcemap: true,
            external_helpers: true,
        };
        transform(options).await.unwrap();
    }
}
