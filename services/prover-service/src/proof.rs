use sha2::{Digest, Sha256};
use std::collections::HashMap;

pub fn generate_mock_proof(
    circuit_id: &str,
    tenant_id: &str,
    issuer_id: &str,
    public_inputs: &HashMap<String, String>,
    witness: Option<&[u8]>,
) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(circuit_id.as_bytes());
    hasher.update(tenant_id.as_bytes());
    hasher.update(issuer_id.as_bytes());

    let mut keys: Vec<&String> = public_inputs.keys().collect();
    keys.sort_unstable();
    for key in keys {
        hasher.update(key.as_bytes());
        if let Some(value) = public_inputs.get(key) {
            hasher.update(value.as_bytes());
        }
    }

    if let Some(witness_bytes) = witness {
        hasher.update(witness_bytes);
    }

    hasher.finalize().to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mock_proof_is_deterministic() {
        let inputs = HashMap::from([("age".to_string(), "20".to_string())]);
        let proof1 = generate_mock_proof("range-age-18", "tenant", "issuer", &inputs, None);
        let proof2 = generate_mock_proof("range-age-18", "tenant", "issuer", &inputs, None);
        assert_eq!(proof1, proof2);
    }

    #[test]
    fn mock_proof_varies_with_inputs() {
        let inputs_one = HashMap::from([("age".to_string(), "20".to_string())]);
        let inputs_two = HashMap::from([("age".to_string(), "25".to_string())]);

        let proof1 = generate_mock_proof("range-age-18", "tenant", "issuer", &inputs_one, None);
        let proof2 = generate_mock_proof("range-age-18", "tenant", "issuer", &inputs_two, None);

        assert_ne!(proof1, proof2);
    }
}
