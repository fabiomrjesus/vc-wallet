using VcWallet.Eth.Contracts.Services;

namespace VcWallet.Eth.Contracts.Interfaces;

public class OffchainSignatureHubOptions : IContractOptions<OffchainSignatureHubService>
{
    public string RpcUrl { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
