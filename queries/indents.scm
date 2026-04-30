; Razor indents.scm for tree-sitter
; Indentation rules

; Indent inside code blocks
[
  (code_directive
    body: (csharp_block_content))
  (functions_directive
    body: (csharp_block_content))
  (code_block
    body: (csharp_block_content))
] @indent

; Indent inside HTML elements
(normal_element) @indent

; Indent inside control structures
[
  (if_statement)
  (foreach_statement)
  (for_statement)
  (while_statement)
  (switch_statement)
  (using_statement)
  (try_statement)
  (catch_clause)
  (finally_clause)
  (lock_statement)
] @indent
