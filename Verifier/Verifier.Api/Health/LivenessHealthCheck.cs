using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Verifier.Api.Health;

/// <summary>
/// Simple liveness check that reports the API is running.
/// </summary>
public class LivenessHealthCheck : IHealthCheck
{
    private static readonly HealthCheckResult HealthyResult = HealthCheckResult.Healthy("Verifier API is alive.");

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(HealthyResult);
    }
}
