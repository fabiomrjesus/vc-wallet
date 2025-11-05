using System.Collections.Generic;

namespace Verifier.App.Options;

public class VerifierOptions
{
    public const string SectionName = "Verifier";

    public string Did { get; init; } = string.Empty;

    public string? ActiveKid { get; init; }

    public JsonWebKeySetOptions Jwks { get; init; } = new();
}

public class JsonWebKeySetOptions
{
    public List<JsonWebKeyOptions> Keys { get; init; } = new();
}

public class JsonWebKeyOptions
{
    public string KeyType { get; init; } = string.Empty;
    public string Curve { get; init; } = string.Empty;
    public string KeyId { get; init; } = string.Empty;
    public string X { get; init; } = string.Empty;
    public string Y { get; init; } = string.Empty;
    public string? Use { get; init; }
    public string? Alg { get; init; }
}
