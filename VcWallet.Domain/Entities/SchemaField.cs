namespace VcWallet.Domain;

public class SchemaField
{
    public SchemaField(string name, string type, bool isRequired)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Schema field name cannot be null or whitespace.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(type))
        {
            throw new ArgumentException("Schema field type cannot be null or whitespace.", nameof(type));
        }

        Name = name;
        Type = type;
        IsRequired = isRequired;
    }

    public string Name { get; }

    public string Type { get; }

    public bool IsRequired { get; }
}
