using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Requests;

public class CreateProofRequestRequest
{
    [JsonPropertyName("templateId")]
    public string TemplateId { get; set; } = string.Empty;

    [JsonPropertyName("aud")]
    public string? Audience { get; set; }

    [JsonPropertyName("callback")]
    public string? Callback { get; set; }
}
