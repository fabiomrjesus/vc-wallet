use std::collections::HashMap;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct CircuitMetadata {
    pub circuit_id: String,
    pub name: String,
    pub description: String,
    pub predicate_type: String,
    pub enabled: bool,
}

#[derive(Clone, Debug, Default)]
pub struct CircuitRegistry {
    circuits: HashMap<String, CircuitMetadata>,
}

impl CircuitRegistry {
    pub fn with_defaults() -> Self {
        let mut registry = CircuitRegistry::default();
        registry.insert(CircuitMetadata {
            circuit_id: "range-age-18".to_string(),
            name: "AgeOver18RangeProof".to_string(),
            description: "Proves that the subject's age is >= 18".to_string(),
            predicate_type: "Range".to_string(),
            enabled: true,
        });
        registry.insert(CircuitMetadata {
            circuit_id: "eq-tax-residency-pt".to_string(),
            name: "IsTaxResidentPT".to_string(),
            description: "Proves that the subject's tax residency is PT".to_string(),
            predicate_type: "Equality".to_string(),
            enabled: true,
        });
        registry
    }

    pub fn get_circuit(&self, circuit_id: &str) -> Option<CircuitMetadata> {
        self.circuits
            .get(circuit_id)
            .filter(|meta| meta.enabled)
            .cloned()
    }

    fn insert(&mut self, metadata: CircuitMetadata) {
        self.circuits.insert(metadata.circuit_id.clone(), metadata);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_registry_contains_expected_circuits() {
        let registry = CircuitRegistry::with_defaults();

        let age = registry.get_circuit("range-age-18").expect("age circuit");
        assert_eq!(age.predicate_type, "Range");
        assert!(age.enabled);

        let residency = registry
            .get_circuit("eq-tax-residency-pt")
            .expect("tax circuit");
        assert_eq!(residency.predicate_type, "Equality");
        assert!(residency.enabled);

        assert!(registry.get_circuit("unknown").is_none());
    }
}
