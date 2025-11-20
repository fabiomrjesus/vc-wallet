namespace VcWallet.Domain;

public class Claim
{
    private readonly Dictionary<string, object?> _attributes;

    public Claim(
        Guid id,
        Guid issuerId,
        Guid tenantId,
        Guid schemaId,
        string subjectId,
        ClaimStatus status = ClaimStatus.Valid,
        DateTimeOffset? issuedAt = null,
        DateTimeOffset? expiresAt = null,
        IEnumerable<KeyValuePair<string, object?>>? attributes = null)
    {
        if (string.IsNullOrWhiteSpace(subjectId))
        {
            throw new ArgumentException("Subject identifier cannot be null or whitespace.", nameof(subjectId));
        }

        Id = id;
        IssuerId = issuerId;
        TenantId = tenantId;
        SchemaId = schemaId;
        SubjectId = subjectId;
        Status = status;
        IssuedAt = issuedAt ?? DateTimeOffset.UtcNow;
        ExpiresAt = expiresAt;
        _attributes = attributes?.ToDictionary(pair => pair.Key, pair => pair.Value) ?? new Dictionary<string, object?>();
    }

    public Guid Id { get; }

    public Guid IssuerId { get; }

    public Guid TenantId { get; }

    public Guid SchemaId { get; }

    public string SubjectId { get; }

    public ClaimStatus Status { get; private set; }

    public DateTimeOffset IssuedAt { get; }

    public DateTimeOffset? ExpiresAt { get; }

    public IReadOnlyDictionary<string, object?> Attributes => _attributes;

    public void Revoke()
    {
        Status = ClaimStatus.Revoked;
    }

    public bool IsActive(DateTimeOffset now) =>
        Status == ClaimStatus.Valid && (!ExpiresAt.HasValue || ExpiresAt > now);
}
