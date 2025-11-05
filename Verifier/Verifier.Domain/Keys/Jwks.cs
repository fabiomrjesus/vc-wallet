using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace Verifier.Domain;

/// <summary>
/// Represents a JSON Web Key within the verifier domain.
/// </summary>
public record JsonWebKey(
    string KeyType,
    string Curve,
    string KeyId,
    string X,
    string Y,
    string? Use = null,
    string? Algorithm = null);

/// <summary>
/// Minimal JSON Web Key Set representation exposed to domain consumers.
/// </summary>
public sealed class Jwks
{
    private readonly IReadOnlyList<JsonWebKey> _keys;

    public Jwks(IEnumerable<JsonWebKey> keys)
    {
        ArgumentNullException.ThrowIfNull(keys);
        _keys = new ReadOnlyCollection<JsonWebKey>(keys.ToList());
    }

    public IReadOnlyList<JsonWebKey> Keys => _keys;

    public int Count => _keys.Count;
}
