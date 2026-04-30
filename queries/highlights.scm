; Razor highlights.scm
; Syntax highlighting queries for tree-sitter-razor

; Directive keywords
[
  "page"
  "inject"
  "model"
  "implements"
  "inherits"
  "layout"
  "attribute"
  "code"
  "functions"
  "namespace"
  "using"
  "typeparam"
  "preservewhitespace"
  "rendermode"
  "static"
] @keyword

; Control structure keywords
[
  "if"
  "else"
  "foreach"
  "for"
  "while"
  "switch"
  "case"
  "default"
  "using"
  "try"
  "catch"
  "finally"
  "lock"
  "in"
] @keyword.control

; Razor comment
(razor_comment) @comment

; C# types and identifiers
(csharp_type) @type
(csharp_identifier) @variable
(identifier_path) @namespace

; String literals
(string_literal) @string

; HTML tags
(tag_name) @tag

; HTML attributes
(attribute_name) @attribute
(attribute_value) @string

; Punctuation
[
  "{"
  "}"
  "("
  ")"
  "["
  "]"
  "<"
  ">"
  "</"
  "/>"
] @punctuation.bracket

"." @punctuation.delimiter
"=" @operator
"@" @punctuation.special

; Method calls
(method_call
  (csharp_identifier) @function.method)

; Directives with semantic highlighting
(inject_directive
  type: (csharp_type) @type
  name: (csharp_identifier) @variable.parameter)

(model_directive
  type: (csharp_type) @type)

(namespace_directive
  name: (identifier_path) @namespace)

(using_directive
  namespace: (identifier_path) @namespace)
