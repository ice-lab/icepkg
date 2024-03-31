use pkg_core::{transform, TransformOptions};
use std::fs;
use std::path::PathBuf;

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn basic_fixtures() {
        let parent_path = fs::canonicalize("./tests/fixtures/basic").unwrap();
        let src_dir = format!("{}/src", parent_path.to_str().unwrap());
        let out_dir = format!("{}/out", parent_path.to_str().unwrap());
        let options = TransformOptions {
            src_dir,
            out_dir,
            clean: true,
        };
        transform(options).await.unwrap();
    }
}
