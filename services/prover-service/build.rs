fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get bundled protoc path from protoc-bin-vendored
    let protoc_path = protoc_bin_vendored::protoc_bin_path()
        .expect("Failed to find bundled protoc");

    // tonic-build 0.12 no longer exposes `protoc_path`; use env var instead.
    // SAFETY: build scripts run single-threaded and we control the value.
    unsafe { std::env::set_var("PROTOC", &protoc_path) };

    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile_protos(&["proto/prover.proto"], &["proto"])?; // <- compile_protos
    Ok(())
}
