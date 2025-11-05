using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Responses;

public class JsonWebKeySetResponse
{
    [JsonPropertyName("keys")]
    public List<JsonWebKeyResponse> Keys { get; set; } = new();
}

public class JsonWebKeyResponse
{
    [JsonPropertyName("kty")]
    public string KeyType { get; set; } = string.Empty;

    [JsonPropertyName("crv")]
    public string Curve { get; set; } = string.Empty;

    [JsonPropertyName("kid")]
    public string KeyId { get; set; } = string.Empty;

    [JsonPropertyName("x")]
    public string X { get; set; } = string.Empty;

    [JsonPropertyName("y")]
    public string Y { get; set; } = string.Empty;
}
