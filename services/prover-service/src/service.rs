use crate::circuit_registry::CircuitRegistry;
use crate::proof::generate_mock_proof;
use crate::proto::{
    GenerateProofRequest, GenerateProofResponse, HealthCheckRequest, HealthCheckResponse,
    ProofVerificationStatus, VerifyProofRequest, VerifyProofResponse,
    prover_service_server::ProverService,
};
use std::sync::Arc;
use tonic::{Request, Response, Status};
use uuid::Uuid;

pub struct ProverServiceImpl {
    registry: Arc<CircuitRegistry>,
}

impl ProverServiceImpl {
    pub fn new(registry: Arc<CircuitRegistry>) -> Self {
        Self { registry }
    }
}

#[tonic::async_trait]
impl ProverService for ProverServiceImpl {
    async fn generate_proof(
        &self,
        request: Request<GenerateProofRequest>,
    ) -> Result<Response<GenerateProofResponse>, Status> {
        let req = request.into_inner();
        tracing::info!(
            circuit_id = %req.circuit_id,
            tenant_id = %req.tenant_id,
            issuer_id = %req.issuer_id,
            "GenerateProof called"
        );

        if self.registry.get_circuit(&req.circuit_id).is_none() {
            let circuit_id = req.circuit_id.clone();
            let response = GenerateProofResponse {
                proof_id: String::new(),
                proof: Vec::new(),
                circuit_id: req.circuit_id,
                public_inputs: req.public_inputs,
                success: false,
                error_message: format!("Unknown or disabled circuit_id: {}", circuit_id),
            };
            return Ok(Response::new(response));
        }

        let witness = if req.witness_blob.is_empty() {
            None
        } else {
            Some(req.witness_blob.as_slice())
        };

        let proof_bytes = generate_mock_proof(
            &req.circuit_id,
            &req.tenant_id,
            &req.issuer_id,
            &req.public_inputs,
            witness,
        );
        let proof_id = Uuid::new_v4().to_string();

        let response = GenerateProofResponse {
            proof_id,
            proof: proof_bytes,
            circuit_id: req.circuit_id,
            public_inputs: req.public_inputs,
            success: true,
            error_message: String::new(),
        };

        Ok(Response::new(response))
    }

    async fn verify_proof(
        &self,
        request: Request<VerifyProofRequest>,
    ) -> Result<Response<VerifyProofResponse>, Status> {
        let req = request.into_inner();
        tracing::info!(
            circuit_id = %req.circuit_id,
            tenant_id = %req.tenant_id,
            issuer_id = %req.issuer_id,
            "VerifyProof called"
        );

        if self.registry.get_circuit(&req.circuit_id).is_none() {
            let response = VerifyProofResponse {
                status: ProofVerificationStatus::StatusError as i32,
                error_message: format!("Unknown or disabled circuit_id: {}", req.circuit_id),
                circuit_id: req.circuit_id,
                proof_id: String::new(),
            };
            return Ok(Response::new(response));
        }

        let witness_hint = if req.witness_hint.is_empty() {
            None
        } else {
            Some(req.witness_hint.as_slice())
        };

        let expected_proof = generate_mock_proof(
            &req.circuit_id,
            &req.tenant_id,
            &req.issuer_id,
            &req.public_inputs,
            witness_hint,
        );

        let (status, error_message) = if expected_proof == req.proof {
            (ProofVerificationStatus::StatusValid, String::new())
        } else {
            (
                ProofVerificationStatus::StatusInvalid,
                "Provided proof does not match expected mock proof".to_string(),
            )
        };

        let response = VerifyProofResponse {
            status: status as i32,
            error_message,
            circuit_id: req.circuit_id,
            proof_id: String::new(),
        };

        Ok(Response::new(response))
    }

    async fn health_check(
        &self,
        _request: Request<HealthCheckRequest>,
    ) -> Result<Response<HealthCheckResponse>, Status> {
        let response = HealthCheckResponse {
            status: "OK".to_string(),
        };
        Ok(Response::new(response))
    }
}
