; Razor injections.scm for tree-sitter
; Language injection queries

; Inject C# into @code blocks
(code_directive
  body: (csharp_block_content) @injection.content
  (#set! injection.language "csharp")
  (#set! injection.combined)
)

; Inject C# into @functions blocks
(functions_directive
  body: (csharp_block_content) @injection.content
  (#set! injection.language "csharp")
  (#set! injection.combined)
)

; Inject C# into @{ } blocks
(code_block
  body: (csharp_block_content) @injection.content
  (#set! injection.language "csharp")
  (#set! injection.combined)
)

; Inject C# into @( ) expressions
(explicit_expression
  expression: (csharp_expression_content) @injection.content
  (#set! injection.language "csharp")
)

; Inject C# into inline expressions
(inline_expression) @injection.content
(#set! injection.language "csharp")

; Inject C# into type contexts
(csharp_type) @injection.content
(#set! injection.language "csharp")

; Inject C# into control structure conditions
(if_statement
  condition: (csharp_expression_content) @injection.content
  (#set! injection.language "csharp")
)

(foreach_statement
  "(" @injection.content.start
  ")" @injection.content.end
  (#set! injection.language "csharp")
)

(for_statement
  "(" @injection.content.start
  ")" @injection.content.end
  (#set! injection.language "csharp")
)

; Inject HTML into elements
(normal_element
  (text) @injection.content
  (#set! injection.language "html")
)
