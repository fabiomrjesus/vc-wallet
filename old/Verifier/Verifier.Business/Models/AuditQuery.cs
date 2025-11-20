namespace Verifier.Business.Models;
public class AuditQuery
{
    public string? TemplateId { get; set; }
    public string? Result { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public int Limit { get; set; } = 100;
}