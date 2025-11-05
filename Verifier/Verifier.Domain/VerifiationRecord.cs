namespace Verifier.Domain;
public class VerificationRecord
{
    public Guid DecisionId { get; set; } = Guid.NewGuid();
    public string TemplateId { get; set; } = default!;
    public string Result { get; set; } = default!;
    public string Reason { get; set; } = default!;
    public string NonceHash { get; set; } = default!;
    public string? IssuerDid { get; set; }
    public string[] Checked { get; set; } = [];
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int LatencyMs { get; set; }
    public string? CorrelationId { get; set; }
    public string? SourceIp { get; set; }
}