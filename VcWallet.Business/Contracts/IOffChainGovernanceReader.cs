namespace VcWallet.Business.Contracts;

public interface IOffChainGovernanceReader
{
    Task<bool> IsSignerAsync(string address, CancellationToken ct = default);
}
