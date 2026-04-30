fn main() {
    let src_dir = std::path::Path::new("src");

    let mut c_config = cc::Build::new();
    c_config.include(&src_dir);
    c_config
        .flag_if_supported("-Wno-unused-parameter")
        .flag_if_supported("-Wno-unused-but-set-variable")
        .flag_if_supported("-Wno-trigraphs");

    let parser_path = src_dir.join("parser.c");
    c_config.file(&parser_path);

    // If scanner.c exists, include it
    let scanner_path = src_dir.join("scanner.c");
    if scanner_path.exists() {
        c_config.file(&scanner_path);
    }

    c_config.compile("tree-sitter-razor");

    // If parser.c does not exist, generate it using tree-sitter-cli
    if !parser_path.exists() {
        let mut cmd = std::process::Command::new("tree-sitter");
        cmd.arg("generate");
        cmd.current_dir(std::env::var("CARGO_MANIFEST_DIR").unwrap());
        let status = cmd.status().expect("Failed to run tree-sitter generate");
        if !status.success() {
            panic!("tree-sitter generate failed");
        }
    }
}
