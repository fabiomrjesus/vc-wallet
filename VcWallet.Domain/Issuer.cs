namespace VcWallet.Domain;

public class Issuer
{
    private readonly HashSet<Guid> _allowedSchemaIds;

    public Issuer(Guid id, Guid tenantId, string name, string identifier, IEnumerable<Guid>? allowedSchemaIds = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Issuer name cannot be null or whitespace.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(identifier))
        {
            throw new ArgumentException("Issuer identifier cannot be null or whitespace.", nameof(identifier));
        }

        Id = id;
        TenantId = tenantId;
        Name = name;
        Identifier = identifier;
        _allowedSchemaIds = allowedSchemaIds != null ? [.. allowedSchemaIds] : [];
    }

    public Guid Id { get; }

    public Guid TenantId { get; }

    public string Name { get; }

    public string Identifier { get; }

    public IReadOnlyCollection<Guid> AllowedSchemaIds => _allowedSchemaIds;

    public void AllowSchema(Guid schemaId)
    {
        _allowedSchemaIds.Add(schemaId);
    }

    public bool CanIssueSchema(Guid schemaId) => _allowedSchemaIds.Contains(schemaId);
}
