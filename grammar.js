/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'razor',

  extras: $ => [
    /\s/,
  ],

  conflicts: $ => [
    [$.markup, $.text],
    [$.inline_expression, $.directive],
    [$.csharp_type],
    [$.csharp_block_content, $.string_literal],
    [$.csharp_block_content],
  ],

  rules: {
    document: $ => repeat(
      choice(
        $.razor_comment,
        $.directive,
        $.code_block,
        $.inline_expression,
        $.explicit_expression,
        $.markup,
      )
    ),

    razor_comment: $ => seq(
      '@*',
      repeat(choice(
        /[^*]/,
        /\*[^@]/,
      )),
      '*@'
    ),

    directive: $ => seq(
      '@',
      choice(
        $.using_directive,
        $.page_directive,
        $.inject_directive,
        $.model_directive,
        $.implements_directive,
        $.inherits_directive,
        $.layout_directive,
        $.attribute_directive,
        $.code_directive,
        $.functions_directive,
        $.namespace_directive,
        $.typeparam_directive,
        $.preservewhitespace_directive,
        $.rendermode_directive,
      )
    ),

    using_directive: $ => seq(
      'using',
      optional(choice('static', 'namespace')),
      field('namespace', $.identifier_path),
      optional(seq('=', field('alias', $.identifier_path))),
    ),

    page_directive: $ => seq(
      'page',
      optional(field('route', $.string_literal)),
    ),

    inject_directive: $ => seq(
      'inject',
      field('type', $.csharp_type),
      field('name', $.csharp_identifier),
    ),

    model_directive: $ => seq(
      'model',
      field('type', $.csharp_type),
    ),

    implements_directive: $ => seq(
      'implements',
      field('type', $.csharp_type),
    ),

    inherits_directive: $ => seq(
      'inherits',
      field('type', $.csharp_type),
    ),

    layout_directive: $ => seq(
      'layout',
      choice(
        field('path', $.string_literal),
        '_null',
      ),
    ),

    attribute_directive: $ => seq(
      'attribute',
      field('type', $.csharp_type),
    ),

    code_directive: $ => seq(
      'code',
      '{',
      field('body', $.csharp_block_content),
      '}'
    ),

    functions_directive: $ => seq(
      'functions',
      '{',
      field('body', $.csharp_block_content),
      '}'
    ),

    namespace_directive: $ => seq(
      'namespace',
      field('name', $.identifier_path),
    ),

    typeparam_directive: $ => seq(
      'typeparam',
      field('name', $.csharp_identifier),
      optional(seq('=', field('default', $.csharp_type))),
    ),

    preservewhitespace_directive: $ => seq(
      'preservewhitespace',
      choice('true', 'false'),
    ),

    rendermode_directive: $ => seq(
      'rendermode',
      field('mode', $.csharp_identifier),
    ),

    code_block: $ => seq(
      '@{',
      field('body', $.csharp_block_content),
      '}'
    ),

    inline_expression: $ => seq(
      '@',
      choice(
        field('identifier', $.csharp_identifier),
        field('access', $.member_access),
        field('call', $.method_call),
      )
    ),

    explicit_expression: $ => seq(
      '@(',
      field('expression', $.csharp_expression_content),
      ')'
    ),

    csharp_block_content: $ => repeat1(
      choice(
        /[^{}@"']+/,
        $.razor_comment,
        $.string_literal,
        $.explicit_expression,
        $.inline_expression,
        seq('{', $.csharp_block_content, '}'),
        seq('"', /[^"]*/, '"'),
        seq("'", /[^']*/, "'"),
      )
    ),

    csharp_expression_content: $ => repeat1(
      choice(
        /[^()@]+/,
        seq('(', $.csharp_expression_content, ')'),
      )
    ),

    csharp_type: $ => seq(
      $.csharp_identifier,
      optional($.generic_args),
      repeat(seq('.', $.csharp_identifier, optional($.generic_args))),
      optional($.array_suffix),
    ),

    generic_args: $ => seq(
      '<',
      repeat1(seq(
        $.csharp_type,
        optional(','),
      )),
      '>'
    ),

    array_suffix: $ => repeat1(seq('[', ']')),

    csharp_identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    identifier_path: $ => seq(
      $.csharp_identifier,
      repeat(seq('.', $.csharp_identifier)),
    ),

    member_access: $ => seq(
      $.csharp_identifier,
      repeat1(seq('.', $.csharp_identifier)),
    ),

    method_call: $ => seq(
      $.csharp_identifier,
      '(',
      optional($.argument_list),
      ')',
    ),

    argument_list: $ => seq(
      $.argument,
      repeat(seq(',', $.argument)),
    ),

    argument: $ => /[^,)]+/,

    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'"),
    ),

    markup: $ => choice(
      $.element,
      $.text,
    ),

    element: $ => choice(
      $.self_closing_element,
      $.normal_element,
    ),

    self_closing_element: $ => seq(
      '<',
      field('name', $.tag_name),
      repeat(field('attribute', $.attribute)),
      '/>'
    ),

    normal_element: $ => seq(
      field('open_tag', $.start_tag),
      repeat(choice(
        $.element,
        $.text,
        $.razor_comment,
        $.inline_expression,
        $.explicit_expression,
        $.code_block,
        $.control_structure,
      )),
      field('close_tag', $.end_tag)
    ),

    start_tag: $ => seq(
      '<',
      field('name', $.tag_name),
      repeat(field('attribute', $.attribute)),
      '>'
    ),

    end_tag: $ => seq(
      '</',
      field('name', $.tag_name),
      '>'
    ),

    tag_name: $ => /[A-Za-z][A-Za-z0-9\-\.]*/,

    attribute: $ => choice(
      $.standard_attribute,
      $.razor_directive_attribute,
    ),

    standard_attribute: $ => seq(
      field('name', $.attribute_name),
      optional(seq(
        '=',
        field('value', choice(
          $.attribute_value,
          $.inline_expression,
          $.explicit_expression,
        ))
      ))
    ),

    razor_directive_attribute: $ => seq(
      field('directive', choice('@bind', '@on', '@ref', '@key', '@attributes')),
      optional(seq(
        '-',
        field('suffix', /[A-Za-z][A-Za-z0-9_]*/),
        optional(seq(
          ':',
          field('modifier', /[A-Za-z]+/)
        ))
      )),
      optional(seq(
        '=',
        field('value', choice(
          $.attribute_value,
          $.inline_expression,
          $.explicit_expression,
        ))
      ))
    ),

    attribute_name: $ => /[@A-Za-z_][@A-Za-z0-9_\-:]*/,

    attribute_value: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'"),
      /[A-Za-z0-9_\-]+/
    ),

    control_structure: $ => seq(
      '@',
      choice(
        $.if_statement,
        $.foreach_statement,
        $.for_statement,
        $.while_statement,
        $.switch_statement,
        $.using_statement,
        $.try_statement,
        $.lock_statement,
      )
    ),

    if_statement: $ => seq(
      'if',
      '(',
      field('condition', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      ),
      optional(seq(
        'else',
        choice(
          field('else_body', $.csharp_block_content),
          field('else_body', $.element),
          field('else_body', $.if_statement),
        )
      ))
    ),

    foreach_statement: $ => seq(
      'foreach',
      '(',
      field('item_type', optional($.csharp_type)),
      field('item', $.csharp_identifier),
      'in',
      field('collection', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    for_statement: $ => seq(
      'for',
      '(',
      field('initializer', $.csharp_expression_content),
      ';',
      field('condition', $.csharp_expression_content),
      ';',
      field('iterator', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    while_statement: $ => seq(
      'while',
      '(',
      field('condition', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    switch_statement: $ => seq(
      'switch',
      '(',
      field('value', $.csharp_expression_content),
      ')',
      '{',
      repeat($.switch_section),
      '}'
    ),

    switch_section: $ => seq(
      repeat1(choice(
        $.switch_label,
      )),
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    switch_label: $ => seq(
      choice('case', 'default'),
      optional(field('value', $.csharp_expression_content)),
      ':'
    ),

    using_statement: $ => seq(
      'using',
      '(',
      field('resource', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    try_statement: $ => seq(
      'try',
      field('body', $.csharp_block_content),
      repeat($.catch_clause),
      optional($.finally_clause)
    ),

    catch_clause: $ => seq(
      'catch',
      optional(seq(
        '(',
        field('exception_type', $.csharp_type),
        optional(field('exception_name', $.csharp_identifier)),
        ')'
      )),
      field('body', $.csharp_block_content)
    ),

    finally_clause: $ => seq(
      'finally',
      field('body', $.csharp_block_content)
    ),

    lock_statement: $ => seq(
      'lock',
      '(',
      field('lock_object', $.csharp_expression_content),
      ')',
      choice(
        field('body', $.csharp_block_content),
        field('body', $.element),
      )
    ),

    text: $ => /[^<@]+/,
  },
});
