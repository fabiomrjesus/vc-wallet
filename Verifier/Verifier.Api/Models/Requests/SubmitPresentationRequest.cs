using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Requests;

public class SubmitPresentationRequest
{
    [JsonPropertyName("templateId")]
    public string TemplateId { get; set; } = string.Empty;

    [JsonPropertyName("nonce")]
    public string Nonce { get; set; } = string.Empty;

    [JsonPropertyName("presentationJwt")]
    public string? PresentationJwt { get; set; }

    [JsonPropertyName("zk_proof")]
    public ZkProofRequest? ZeroKnowledgeProof { get; set; }
}

public class ZkProofRequest
{
    [JsonPropertyName("proof")]
    public string Proof { get; set; } = string.Empty;

    [JsonPropertyName("publicInputs")]
    public Dictionary<string, string>? PublicInputs { get; set; }
}
