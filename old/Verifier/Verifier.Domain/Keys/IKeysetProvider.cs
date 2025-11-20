namespace Verifier.Domain;

public interface IKeysetProvider
{
    bool HasActiveKey();

    string? GetActiveKid();

    Jwks GetPublicJwks();
}
