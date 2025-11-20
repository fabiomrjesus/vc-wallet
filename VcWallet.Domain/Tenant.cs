namespace VcWallet.Domain;

public class Tenant
{
    private readonly List<string> _networks;

    public Tenant(Guid id, string name, string? description = null, IEnumerable<string>? networks = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Tenant name cannot be null or whitespace.", nameof(name));
        }

        Id = id;
        Name = name;
        Description = description;
        _networks = networks?.ToList() ?? new List<string>();
    }

    public Guid Id { get; }

    public string Name { get; }

    public string? Description { get; }

    public IReadOnlyCollection<string> Networks => _networks.AsReadOnly();
}
