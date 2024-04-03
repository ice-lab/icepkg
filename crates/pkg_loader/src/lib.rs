use anyhow::Result;
use std::{any::Any, collections::HashMap, fmt::Debug};
use swc_compiler::ast::javascript::Ast;

pub trait BuildErrorLike: Debug + Sync + Send {
    fn code(&self) -> String;

    fn message(&self) -> String;
    // TODO: Implement Diagnostic
}

#[derive(Debug)]
pub struct TransformTaskOptions<'a> {
    pub target: &'a str,
    pub module: &'a str,
    pub alias_config: &'a HashMap<String, String>,
}

pub struct GenerateOutput {
    pub code: String,
    pub map: Option<String>,
}
pub type GenerateReturn = Result<Option<GenerateOutput>>;

#[async_trait::async_trait]
pub trait Loader: Send + Sync + Debug + 'static + Any {
    fn name(&self) -> &'static str;

    fn can_reuse_ast(&self) -> bool;

    async fn transform(
        &self,
        _id: &str,
        _ast: &mut Ast,
        _transform_task_options: &TransformTaskOptions,
    ) {
    }

    async fn generate(
        &self,
        _id: &str,
        _code: String,
        _map: Option<String>,
        _transform_task_options: &TransformTaskOptions,
    ) -> GenerateReturn {
        Ok(None)
    }
}
