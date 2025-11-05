using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Responses;

public class CreateProofRequestResponse
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("templateId")]
    public string TemplateId { get; set; } = string.Empty;

    [JsonPropertyName("aud")]
    public string? Audience { get; set; }

    [JsonPropertyName("nonce")]
    public string Nonce { get; set; } = string.Empty;

    [JsonPropertyName("exp")]
    public DateTimeOffset Expiration { get; set; }

    [JsonPropertyName("callback")]
    public string? Callback { get; set; }

    [JsonPropertyName("format")]
    public List<string> Format { get; set; } = new();
}
