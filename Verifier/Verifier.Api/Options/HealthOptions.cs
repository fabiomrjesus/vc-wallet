namespace Verifier.Api.Options;

public class ReadinessOptions
{
    public const string SectionName = "Health:Readiness";

    public int? TimeoutMs { get; init; }

    public bool IncludeRngCheck { get; init; } = true;
}
