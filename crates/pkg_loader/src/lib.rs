use anyhow::Result;
use std::{any::Any, fmt::Debug};

pub struct LoaderOutput {
    pub code: String,
    pub map: Option<String>,
}

#[derive(Debug)]
pub struct LoaderArgs<'a> {
    pub id: &'a str,
    pub code: &'a String,
}
pub trait BuildErrorLike: Debug + Sync + Send {
    fn code(&self) -> String;

    fn message(&self) -> String;
    // TODO:
    // fn diagnostic_builder(&self) -> DiagnosticBuilder {
    //     DiagnosticBuilder {
    //         code: Some(self.code()),
    //         summary: Some(self.message()),
    //         ..Default::default()
    //     }
    // }
}

pub type LoaderReturn = Result<Option<LoaderOutput>>;

#[derive(Debug)]
pub struct BuildError {
    inner: Box<dyn BuildErrorLike>,
    source: Option<Box<dyn std::error::Error + 'static + Send + Sync>>,
}

#[async_trait::async_trait]
pub trait Loader: Send + Sync + Debug + 'static + Any {
    fn name(&self) -> &'static str;

    async fn run(&self, _input: &LoaderArgs) -> LoaderReturn {
        Ok(None)
    }
}
