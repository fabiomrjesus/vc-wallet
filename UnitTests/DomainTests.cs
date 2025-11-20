using VcWallet.Domain;

namespace UnitTests;

[TestClass]
public class SampleDataTests
{
    [TestMethod]
    public void Issuers_share_tenant_and_tenant_has_name()
    {
        var (tenant, issuers, _) = SampleData.BuildDemoGraph();

        Assert.IsFalse(string.IsNullOrWhiteSpace(tenant.Name));
        foreach (var issuer in issuers)
        {
            Assert.AreEqual(tenant.Id, issuer.TenantId);
        }
    }

    [TestMethod]
    public void Issuer_schema_permissions_match_configuration()
    {
        var (tenant, issuers, schemas) = SampleData.BuildDemoGraph();
        var ageSchema = schemas.First(s => s.Name == "AgeCredential");
        var taxResidencySchema = schemas.First(s => s.Name == "TaxResidencyCredential");

        var socialSecurity = issuers.First(i => i.Name == "Segurança Social");
        Assert.IsTrue(socialSecurity.CanIssueSchema(ageSchema.Id));
        Assert.IsFalse(socialSecurity.CanIssueSchema(taxResidencySchema.Id));

        var finances = issuers.First(i => i.Name == "Finanças");
        Assert.IsTrue(finances.CanIssueSchema(taxResidencySchema.Id));
        Assert.IsFalse(finances.CanIssueSchema(ageSchema.Id));
    }
}

[TestClass]
public class ClaimTests
{
    [TestMethod]
    public void Claim_defaults_to_valid_with_issued_at_set()
    {
        var (tenant, issuers, schemas) = SampleData.BuildDemoGraph();
        var socialSecurity = issuers.First(i => i.Name == "Segurança Social");
        var ageSchema = schemas.First(s => s.Name == "AgeCredential");

        var claim = new Claim(
            Guid.NewGuid(),
            socialSecurity.Id,
            tenant.Id,
            ageSchema.Id,
            "subject-1",
            attributes: new Dictionary<string, object?> { { "age", 30 } });

        Assert.AreEqual(ClaimStatus.Valid, claim.Status);
        Assert.AreNotEqual(default, claim.IssuedAt);
    }

    [TestMethod]
    public void Claim_revoke_sets_status()
    {
        var (tenant, issuers, schemas) = SampleData.BuildDemoGraph();
        var socialSecurity = issuers.First(i => i.Name == "Segurança Social");
        var ageSchema = schemas.First(s => s.Name == "AgeCredential");

        var claim = new Claim(
            Guid.NewGuid(),
            socialSecurity.Id,
            tenant.Id,
            ageSchema.Id,
            "subject-1",
            attributes: new Dictionary<string, object?> { { "age", 30 } });

        claim.Revoke();

        Assert.AreEqual(ClaimStatus.Revoked, claim.Status);
    }
}

[TestClass]
public class PredicateSpecTests
{
    [TestMethod]
    public void Predicate_specs_construct_correctly()
    {
        var (_, _, schemas) = SampleData.BuildDemoGraph();
        var ageSchema = schemas.First(s => s.Name == "AgeCredential");
        var taxSchema = schemas.First(s => s.Name == "TaxResidencyCredential");

        var agePredicate = new PredicateSpec(
            Guid.NewGuid(),
            ageSchema.Id,
            "AgeOver18",
            PredicateType.Range,
            "age",
            ">=",
            18);

        var countryPredicate = new PredicateSpec(
            Guid.NewGuid(),
            taxSchema.Id,
            "CountryIsPT",
            PredicateType.Equality,
            "country",
            "==",
            "PT");

        Assert.AreEqual(PredicateType.Range, agePredicate.Type);
        Assert.AreEqual("age", agePredicate.FieldName);
        Assert.AreEqual(">=", agePredicate.Operator);
        Assert.AreEqual(18, agePredicate.Value);

        Assert.AreEqual(PredicateType.Equality, countryPredicate.Type);
        Assert.AreEqual("country", countryPredicate.FieldName);
        Assert.AreEqual("==", countryPredicate.Operator);
        Assert.AreEqual("PT", countryPredicate.Value);
    }

    [TestMethod]
    public void Predicate_spec_invalid_inputs_throw()
    {
        var (_, _, schemas) = SampleData.BuildDemoGraph();
        var ageSchema = schemas.First(s => s.Name == "AgeCredential");

        Assert.ThrowsException<ArgumentException>(() =>
            new PredicateSpec(Guid.NewGuid(), ageSchema.Id, string.Empty, PredicateType.Range, "age", ">=", 18));

        Assert.ThrowsException<ArgumentException>(() =>
            new PredicateSpec(Guid.NewGuid(), ageSchema.Id, "AgePredicate", PredicateType.Range, string.Empty, ">=", 18));
    }
}
