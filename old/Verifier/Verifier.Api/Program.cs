using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Verifier.Api.Health;
using Verifier.Api.Middleware;
using Verifier.Api.Options;
using Verifier.App.Keys;
using Verifier.App.Options;
using Verifier.Domain;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole();

builder.Services.Configure<VerifierOptions>(builder.Configuration.GetSection(VerifierOptions.SectionName));
builder.Services.Configure<HttpOptions>(builder.Configuration.GetSection(HttpOptions.SectionName));
builder.Services.Configure<ReadinessOptions>(builder.Configuration.GetSection(ReadinessOptions.SectionName));

var httpOptions = builder.Configuration.GetSection(HttpOptions.SectionName).Get<HttpOptions>() ?? new HttpOptions();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ConfiguredCors", policy =>
    {
        if (httpOptions.Cors.AllowedOrigins.Count == 0 || httpOptions.Cors.AllowedOrigins.Any(origin => string.Equals(origin, "*", StringComparison.OrdinalIgnoreCase)))
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins([.. httpOptions.Cors.AllowedOrigins]);
        }

        if (httpOptions.Cors.AllowedHeaders.Count == 0 || httpOptions.Cors.AllowedHeaders.Any(header => string.Equals(header, "*", StringComparison.OrdinalIgnoreCase)))
        {
            policy.AllowAnyHeader();
        }
        else
        {
            policy.WithHeaders([.. httpOptions.Cors.AllowedHeaders]);
        }

        if (httpOptions.Cors.AllowedMethods.Count == 0 || httpOptions.Cors.AllowedMethods.Any(method => string.Equals(method, "*", StringComparison.OrdinalIgnoreCase)))
        {
            policy.AllowAnyMethod();
        }
        else
        {
            policy.WithMethods([.. httpOptions.Cors.AllowedMethods]);
        }
    });
});

var readinessTimeoutMs = builder.Configuration.GetValue<int?>("Health:Readiness:TimeoutMs");
builder.Services
    .AddHealthChecks()
    .AddCheck<LivenessHealthCheck>("liveness")
    .AddCheck<ReadinessHealthCheck>("readiness", tags: ["readiness"], timeout: readinessTimeoutMs.HasValue ? TimeSpan.FromMilliseconds(readinessTimeoutMs.Value) : null);
builder.Services.AddSingleton<IKeysetProvider, InMemoryKeysetProvider>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

var requestIdHeader = string.IsNullOrWhiteSpace(httpOptions.RequestIdHeader) ? "X-Request-Id" : httpOptions.RequestIdHeader;

app.UseHttpsRedirection();
app.UseCors("ConfiguredCors");
app.UseRequestId(requestIdHeader);
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = registration => registration.Name.Equals("liveness", StringComparison.OrdinalIgnoreCase),
    ResponseWriter = WriteHealthResponse
});
app.MapHealthChecks(
    "/ready",
    new HealthCheckOptions
    {
        Predicate = registration => registration.Tags.Any(tag => string.Equals(tag, "readiness", StringComparison.OrdinalIgnoreCase)),
        ResponseWriter = WriteHealthResponse
    });

app.Run();

static async Task WriteHealthResponse(HttpContext context, HealthReport report)
{
    context.Response.Headers["Cache-Control"] = "no-store";
    context.Response.ContentType = "text/plain";
    await context.Response.WriteAsync(report.Status.ToString());
}
