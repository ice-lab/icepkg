use pkg_core::{transform, TransformOptions};
use std::fs;

#[cfg(test)]
mod test {
    use super::*;
    use std::vec;

    #[tokio::test]
    async fn basic_fixtures() {
        let parent_path = fs::canonicalize("./tests/fixtures/basic").unwrap();
        let src_dir = format!("{}/src", parent_path.to_str().unwrap());
        let out_dir = format!("{}/out", parent_path.to_str().unwrap());
        let options = TransformOptions {
            src_dir,
            out_dir,
            input_files: vec!["./a.ts".to_string(), "./b.js".to_string()],
            target: "es5".to_string(),
            module: "es6".to_string(),
        };
        transform(options).await.unwrap();
    }
}
