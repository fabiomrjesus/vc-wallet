using VcWallet.Business.Contracts;
using VcWallet.Eth.Contracts.Interfaces;

namespace VcWallet.Api.Services;

public class OffchainGovernanceReaderAdapter : IOffChainGovernanceReader
{
    private readonly IOffchainSignatureHubService _service;

    public OffchainGovernanceReaderAdapter(IOffchainSignatureHubService service)
    {
        _service = service;
    }

    public Task<bool> IsSignerAsync(string address, CancellationToken ct = default)
    {
        return _service.IsSignerAsync(address, ct);
    }
}
