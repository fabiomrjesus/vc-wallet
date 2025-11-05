using System;
using System.Linq;
using Microsoft.Extensions.Options;
using Verifier.App.Options;
using Verifier.Domain;

namespace Verifier.App.Keys;

public sealed class InMemoryKeysetProvider : IKeysetProvider
{
    private readonly string? _activeKid;
    private readonly bool _hasActiveKey;
    private readonly Jwks _publicJwks;

    public InMemoryKeysetProvider(IOptions<VerifierOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

        var value = options.Value ?? throw new ArgumentException("Verifier options are not configured.", nameof(options));
        _activeKid = value.ActiveKid;

        var publicKeys = value.Jwks?.Keys?.Select(
            key => new JsonWebKey(
                key.KeyType,
                key.Curve,
                key.KeyId,
                key.X,
                key.Y,
                key.Use,
                key.Alg)).ToArray() ?? [];

        _publicJwks = new Jwks(publicKeys);

        _hasActiveKey = !string.IsNullOrWhiteSpace(_activeKid)
            && _publicJwks.Keys.Any(key => string.Equals(key.KeyId, _activeKid, StringComparison.Ordinal));
    }

    public bool HasActiveKey() => _hasActiveKey;

    public string? GetActiveKid() => _hasActiveKey ? _activeKid : null;

    public Jwks GetPublicJwks() => _publicJwks;
}
