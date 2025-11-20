namespace VcWallet.Domain;

public class PredicateSpec
{
    public PredicateSpec(Guid id, Guid schemaId, string name, PredicateType type, string fieldName, string @operator, object? value)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Predicate name cannot be null or whitespace.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(fieldName))
        {
            throw new ArgumentException("Predicate field name cannot be null or whitespace.", nameof(fieldName));
        }

        if (string.IsNullOrWhiteSpace(@operator))
        {
            throw new ArgumentException("Predicate operator cannot be null or whitespace.", nameof(@operator));
        }

        if (type == PredicateType.SetMembership && value is null)
        {
            throw new ArgumentException("Set membership predicates require a value representing the set.", nameof(value));
        }

        Id = id;
        SchemaId = schemaId;
        Name = name;
        Type = type;
        FieldName = fieldName;
        Operator = @operator;
        Value = value;
    }

    public Guid Id { get; }

    public Guid SchemaId { get; }

    public string Name { get; }

    public PredicateType Type { get; }

    public string FieldName { get; }

    public string Operator { get; }

    public object? Value { get; }
}
