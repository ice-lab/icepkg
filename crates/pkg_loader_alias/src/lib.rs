use std::collections::HashMap;

use pkg_loader::{Loader, TransformTaskOptions};
use regex::{self, Captures, Regex};
use swc_compiler::ast::javascript::Ast;
use swc_core::ecma::visit::{as_folder, VisitMut};

#[derive(Debug)]
pub struct LoaderAlias;

#[async_trait::async_trait]
impl<'a> Loader for LoaderAlias {
    fn name(&self) -> &'static str {
        "builtin-loader-alias"
    }

    fn can_reuse_ast(&self) -> bool {
        true
    }

    async fn transform(
        &self,
        _id: &str,
        ast: &mut Ast,
        transform_task_options: &TransformTaskOptions,
    ) {
        ast.program
            .visit_mut_with(&mut as_folder(AliasTransformVisitor {
                alias_config: transform_task_options.alias_config.clone(),
            }));
    }
}

pub struct AliasTransformVisitor {
    alias_config: HashMap<String, String>,
}

impl VisitMut for AliasTransformVisitor {
    fn visit_mut_import_decl(&mut self, decl: &mut swc_core::ecma::ast::ImportDecl) {
        let source = decl.src.value.to_string();

        if let Some(matched_key) = self
            .alias_config
            .keys()
            .find(|&key| source.starts_with(key))
        {
            let alias_path = self.alias_config.get(matched_key).expect("");
            let re = Regex::new(&format!("^({})(.*)", matched_key)).expect("create alias error.");
            let new_src = re.replace(&source, |caps: &Captures| {
                format!("{}{}", alias_path, &caps[2])
            });
            decl.src.value = new_src.into();
        }
    }
}
