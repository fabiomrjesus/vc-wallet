using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Verifier.Api.Options;
using Verifier.Domain;

namespace Verifier.Api.Health;

/// <summary>
/// Validates readiness by ensuring an active signing key is configured and cryptographic services are responsive.
/// </summary>
public class ReadinessHealthCheck : IHealthCheck
{
    private readonly IKeysetProvider _keysetProvider;
    private readonly ReadinessOptions _options;

    public ReadinessHealthCheck(IKeysetProvider keysetProvider, IOptions<ReadinessOptions> options)
    {
        _keysetProvider = keysetProvider ?? throw new ArgumentNullException(nameof(keysetProvider));
        _options = options?.Value ?? new ReadinessOptions();
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (_options.IncludeRngCheck)
        {
            Span<byte> buffer = stackalloc byte[32];
            RandomNumberGenerator.Fill(buffer);
        }

        var hasActiveKey = _keysetProvider.HasActiveKey();
        var activeKid = _keysetProvider.GetActiveKid();
        var jwks = _keysetProvider.GetPublicJwks();
        var data = new Dictionary<string, object>
        {
            ["activeKid"] = activeKid ?? string.Empty,
            ["keysCount"] = jwks.Count,
            ["rngChecked"] = _options.IncludeRngCheck
        };

        if (!hasActiveKey)
        {
            return Task.FromResult(HealthCheckResult.Unhealthy("Active signing key is not configured.", data:data));
        }

        return Task.FromResult(HealthCheckResult.Healthy("Verifier is ready.", data));
    }
}
