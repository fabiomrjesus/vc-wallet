using System.Collections.Generic;

namespace Verifier.Api.Options;

public class HttpOptions
{
    public const string SectionName = "Http";

    public CorsOptions Cors { get; init; } = new();

    public string RequestIdHeader { get; init; } = "X-Request-Id";
}

public class CorsOptions
{
    public List<string> AllowedOrigins { get; init; } = new();

    public List<string> AllowedHeaders { get; init; } = new();

    public List<string> AllowedMethods { get; init; } = new();
}
