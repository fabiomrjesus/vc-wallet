use prover_service::{
    CircuitRegistry, ProverServiceImpl, proto::prover_service_server::ProverServiceServer,
};
use std::{env, net::SocketAddr, sync::Arc};
use tonic::transport::Server;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt().with_env_filter("info").init();

    let port = env::var("PROVER_GRPC_PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(50051);
    let addr: SocketAddr = format!("0.0.0.0:{port}").parse()?;

    let registry = Arc::new(CircuitRegistry::with_defaults());
    let service = ProverServiceImpl::new(registry);

    tracing::info!("Starting ProverService gRPC server on {addr}");

    Server::builder()
        .add_service(ProverServiceServer::new(service))
        .serve(addr)
        .await?;

    Ok(())
}
