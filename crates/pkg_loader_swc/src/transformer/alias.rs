use regex::{self, Captures, Regex};
use swc_core::ecma::{ast::ImportDecl, visit::Fold};

struct Alias {
    alias_config: serde_json::Map<String, serde_json::Value>,
}

pub fn alias_transform(alias_config: serde_json::Map<String, serde_json::Value>) -> impl Fold {
    Alias { alias_config }
}

impl Fold for Alias {
    fn fold_import_decl(&mut self, decl: ImportDecl) -> ImportDecl {
        let source = decl.src.value.to_string();

        if let Some(matched_key) = self
            .alias_config
            .keys()
            .find(|&key| source.starts_with(key))
        {
            let alias_path = self.alias_config.get(matched_key).expect("");
            let re = Regex::new(&format!("^({})(.*)", matched_key)).expect("create alias error.");
            let new_src = re.replace(&source, |caps: &Captures| {
                // TODO: format the correct
                format!("{}{}", alias_path, &caps[2])
            });
            let mut new_decl = decl.clone();
            new_decl.src.value = new_src.into();

            new_decl
        } else {
            decl
        }
    }
}
