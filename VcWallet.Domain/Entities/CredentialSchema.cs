namespace VcWallet.Domain;

public class CredentialSchema
{
    private readonly List<SchemaField> _fields;

    public CredentialSchema(Guid id, Guid tenantId, string name, string version, IEnumerable<SchemaField>? fields = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Schema name cannot be null or whitespace.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(version))
        {
            throw new ArgumentException("Schema version cannot be null or whitespace.", nameof(version));
        }

        Id = id;
        TenantId = tenantId;
        Name = name;
        Version = version;
        _fields = fields?.ToList() ?? new List<SchemaField>();
    }

    public Guid Id { get; }

    public Guid TenantId { get; }

    public string Name { get; }

    public string Version { get; }

    public IReadOnlyCollection<SchemaField> Fields => _fields.AsReadOnly();

    public void AddField(SchemaField field)
    {
        ArgumentNullException.ThrowIfNull(field);
        _fields.Add(field);
    }
}
