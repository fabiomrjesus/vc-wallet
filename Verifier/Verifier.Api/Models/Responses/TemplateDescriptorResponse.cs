using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifier.Api.Models.Responses;

public class TemplateDescriptorResponse
{
    [JsonPropertyName("templateId")]
    public string TemplateId { get; set; } = string.Empty;

    [JsonPropertyName("acceptedFormats")]
    public List<string> AcceptedFormats { get; set; } = new();
}
