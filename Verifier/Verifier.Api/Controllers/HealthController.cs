using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Verifier.Api.Models.Responses;

namespace Verifier.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly HealthCheckService _healthCheckService;

    public HealthController(HealthCheckService healthCheckService)
    {
        _healthCheckService = healthCheckService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthStatusResponse>> GetHealth(CancellationToken cancellationToken)
    {
        var report = await _healthCheckService.CheckHealthAsync(cancellationToken);

        Response.Headers["Cache-Control"] = "no-store";

        var response = new HealthStatusResponse
        {
            Status = report.Status.ToString()
        };

        return StatusCode(MapStatusCode(report.Status), response);
    }

    [HttpGet("ready")]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthStatusResponse>> GetReady(CancellationToken cancellationToken)
    {
        var report = await _healthCheckService.CheckHealthAsync(
            registration => registration.Tags.Contains("readiness"),
            cancellationToken);

        Response.Headers["Cache-Control"] = "no-store";

        var response = new HealthStatusResponse
        {
            Status = report.Status.ToString()
        };

        return StatusCode(MapStatusCode(report.Status), response);
    }

    private static int MapStatusCode(HealthStatus status) =>
        status switch
        {
            HealthStatus.Healthy => StatusCodes.Status200OK,
            HealthStatus.Degraded => StatusCodes.Status200OK,
            _ => StatusCodes.Status503ServiceUnavailable
        };
}
