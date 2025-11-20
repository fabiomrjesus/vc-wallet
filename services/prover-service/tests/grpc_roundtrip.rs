use prover_service::{
    CircuitRegistry, ProverServiceImpl,
    proto::{
        GenerateProofRequest, ProofVerificationStatus, VerifyProofRequest,
        prover_service_client::ProverServiceClient, prover_service_server::ProverServiceServer,
    },
};
use std::{collections::HashMap, sync::Arc};
use tokio::net::TcpListener;
use tokio_stream::wrappers::TcpListenerStream;
use tonic::Request;
use tonic::transport::Server;

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn generate_then_verify_roundtrip() -> Result<(), Box<dyn std::error::Error>> {
    let registry = Arc::new(CircuitRegistry::with_defaults());
    let service = ProverServiceImpl::new(registry);

    let listener = TcpListener::bind("127.0.0.1:0").await?;
    let addr = listener.local_addr()?;

    let server = Server::builder()
        .add_service(ProverServiceServer::new(service))
        .serve_with_incoming(TcpListenerStream::new(listener));

    let server_handle = tokio::spawn(server);

    let mut client = ProverServiceClient::connect(format!("http://{}", addr)).await?;

    let public_inputs = HashMap::from([("age".to_string(), "20".to_string())]);

    let generate_response = client
        .generate_proof(Request::new(GenerateProofRequest {
            circuit_id: "range-age-18".to_string(),
            tenant_id: "tenant-1".to_string(),
            issuer_id: "issuer-1".to_string(),
            public_inputs: public_inputs.clone(),
            witness_blob: Vec::new(),
        }))
        .await?
        .into_inner();

    assert!(generate_response.success);
    assert!(!generate_response.proof.is_empty());

    let verify_response = client
        .verify_proof(Request::new(VerifyProofRequest {
            circuit_id: "range-age-18".to_string(),
            tenant_id: "tenant-1".to_string(),
            issuer_id: "issuer-1".to_string(),
            proof: generate_response.proof.clone(),
            public_inputs: public_inputs.clone(),
            witness_hint: Vec::new(),
        }))
        .await?
        .into_inner();

    assert_eq!(
        verify_response.status,
        ProofVerificationStatus::StatusValid as i32
    );

    let mut tampered_proof = generate_response.proof.clone();
    tampered_proof[0] ^= 0xFF;

    let invalid_response = client
        .verify_proof(Request::new(VerifyProofRequest {
            circuit_id: "range-age-18".to_string(),
            tenant_id: "tenant-1".to_string(),
            issuer_id: "issuer-1".to_string(),
            proof: tampered_proof,
            public_inputs,
            witness_hint: Vec::new(),
        }))
        .await?
        .into_inner();

    assert_eq!(
        invalid_response.status,
        ProofVerificationStatus::StatusInvalid as i32
    );

    server_handle.abort();
    let _ = server_handle.await;

    Ok(())
}
