//! This crate provides Razor language support for the [tree-sitter][] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"
//! @page
//! @inject MyService Service
//!
//! <h1>@Service.GetTitle()</h1>
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_razor::LANGUAGE;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading Razor grammar");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [Parser]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/tree-sitter/

#![deny(clippy::cargo_common_metadata)]
#![deny(clippy::doc_markdown)]
#![deny(clippy::missing_docs_in_private_items)]
#![deny(clippy::panicking_unwrap)]
#![deny(missing_docs)]
#![deny(rustdoc::broken_intra_doc_links)]
#![deny(rustdoc::private_intra_doc_links)]
#![forbid(unsafe_code)]

use tree_sitter_language::LanguageFn;

/// The tree-sitter [`LanguageFn`] for this grammar.
///
/// [`LanguageFn`]: https://docs.rs/tree-sitter-language/*/tree_sitter_language/struct.LanguageFn.html
pub const LANGUAGE: LanguageFn = unsafe { tree_sitter_razor };

/// The content of the [`node-types.json`][] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types#node-types-json
#[cfg(feature = "node-types")]
pub const NODE_TYPES: &str = include_str!("../../src/node-types.json");

/// Empty node types when feature is not enabled.
#[cfg(not(feature = "node-types"))]
pub const NODE_TYPES: &str = "";

/// The content of the [`highlights.scm`][] file for this grammar.
///
/// [`highlights.scm`]: https://tree-sitter.github.io/tree-sitter/using-parsers/syntax-highlighting#highlight
pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");

/// The content of the [`injections.scm`][] file for this grammar.
///
/// [`injections.scm`]: https://tree-sitter.github.io/tree-sitter/using-parsers/syntax-highlighting#language-injection
pub const INJECTIONS_QUERY: &str = include_str!("../../queries/injections.scm");

/// The content of the [`locals.scm`][] file for this grammar.
///
/// [`locals.scm`]: https://tree-sitter.github.io/tree-sitter/using-parsers/syntax-highlighting#local-variables
pub const LOCALS_QUERY: &str = "";

/// The symbol tagging query for this grammar.
pub const TAGS_QUERY: &str = "";

extern "C" {
    fn tree_sitter_razor() -> LanguageFn;
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading Razor grammar");
    }
}
