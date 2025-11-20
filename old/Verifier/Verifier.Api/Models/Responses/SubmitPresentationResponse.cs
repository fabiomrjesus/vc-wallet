using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Responses;

public class SubmitPresentationResponse
{
    [JsonPropertyName("decisionId")]
    public string DecisionId { get; set; } = string.Empty;

    [JsonPropertyName("result")]
    public string Result { get; set; } = string.Empty;

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = string.Empty;

    [JsonPropertyName("issuerDid")]
    public string IssuerDid { get; set; } = string.Empty;

    [JsonPropertyName("checked")]
    public List<string> Checked { get; set; } = new();

    [JsonPropertyName("latencyMs")]
    public int LatencyMs { get; set; }
}
