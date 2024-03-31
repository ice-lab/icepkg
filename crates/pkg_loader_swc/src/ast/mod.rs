use crate::ast::javascript::Ast as JsAst;
pub mod javascript;
pub mod stringify;

pub use stringify::*;

#[derive(Debug, Clone, Hash)]
pub enum Ast {
    JavaScript(JsAst),
}

impl Ast {
    pub fn as_javascript(&self) -> Option<&JsAst> {
        match self {
            Ast::JavaScript(program) => Some(program),
            // Ast::Css(_) => None,
        }
    }
}
