using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Responses;

public class HealthStatusResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}
