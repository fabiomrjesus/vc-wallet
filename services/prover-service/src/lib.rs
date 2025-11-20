pub mod circuit_registry;
pub mod proof;
pub mod proto {
    tonic::include_proto!("prover");
}
pub mod service;

pub use circuit_registry::{CircuitMetadata, CircuitRegistry};
pub use service::ProverServiceImpl;
