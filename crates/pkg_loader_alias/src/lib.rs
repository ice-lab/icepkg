use pkg_loader::{Loader, LoaderArgs, LoaderOutput, LoaderReturn};

#[derive(Debug)]
pub struct LoaderAlias;

#[async_trait::async_trait]
impl Loader for LoaderAlias {
    fn name(&self) -> &'static str {
        "builtin-loader-alias"
    }

    async fn run(&self, input: &LoaderArgs) -> LoaderReturn {
        println!("LoaderAlias::run: id: {}, code: {}", input.id, input.code);
        let new_code = input.code.replace("add", "sub");
        Ok(Some(LoaderOutput {
            code: new_code,
            map: None,
        }))
    }
}
