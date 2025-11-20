namespace VcWallet.Domain;

public static class SampleData
{
    private static readonly Guid TenantId = Guid.Parse("5c7ad1d6-3295-4ded-8a36-34c583fea567");
    private static readonly Guid SocialSecurityIssuerId = Guid.Parse("c2b2d8b2-0303-4d2d-8f7f-ff2bd615a717");
    private static readonly Guid FinancesIssuerId = Guid.Parse("de9e186c-2f46-4d33-a582-3a3b4b0a29af");
    private static readonly Guid AgeCredentialSchemaId = Guid.Parse("ddbc04bb-7b57-4277-9a56-5fe2f61b53fd");
    private static readonly Guid TaxResidencySchemaId = Guid.Parse("848d9ca5-55db-4f76-8722-7c38b732f78e");

    public static (Tenant Tenant, IReadOnlyCollection<Issuer> Issuers, IReadOnlyCollection<CredentialSchema> Schemas) BuildDemoGraph()
    {
        var tenant = new Tenant(TenantId, "Portuguese State");

        var ageSchema = new CredentialSchema(
            AgeCredentialSchemaId,
            TenantId,
            "AgeCredential",
            "1.0",
            new[]
            {
                new SchemaField("age", "int", true)
            });

        var taxResidencySchema = new CredentialSchema(
            TaxResidencySchemaId,
            TenantId,
            "TaxResidencyCredential",
            "1.0",
            new[]
            {
                new SchemaField("country", "string", true)
            });

        var socialSecurity = new Issuer(SocialSecurityIssuerId, TenantId, "Segurança Social", "pt-ss");
        socialSecurity.AllowSchema(ageSchema.Id);

        var finances = new Issuer(FinancesIssuerId, TenantId, "Finanças", "pt-at");
        finances.AllowSchema(taxResidencySchema.Id);

        return (tenant, new[] { socialSecurity, finances }, new[] { ageSchema, taxResidencySchema });
    }
}
