using Nethereum.Web3;
using VcWallet.Eth.Contracts.Interfaces;

namespace VcWallet.Eth.Contracts.Services;

public class OnChainSignatureHubService
{
    private readonly Web3 _web3;
    private readonly Nethereum.Contracts.Function _isSignerFunction;

    private const string MinimalIsSignerAbi =
        "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"}],\"name\":\"isSigner\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]";

    public OnChainSignatureHubService(IContractOptions<OnChainSignatureHubService> options)
    {
        if (string.IsNullOrWhiteSpace(options.RpcUrl))
            throw new ArgumentException("RpcUrl is required for OnChainSignatureHubService", nameof(options));
        if (string.IsNullOrWhiteSpace(options.Address))
            throw new ArgumentException("Address is required for OnChainSignatureHubService", nameof(options));

        _web3 = new Web3(options.RpcUrl);
        var contract = _web3.Eth.GetContract(MinimalIsSignerAbi, options.Address);
        _isSignerFunction = contract.GetFunction("isSigner");
    }

    public Task<bool> IsSignerAsync(string address, CancellationToken ct = default)
    {
        return _isSignerFunction.CallAsync<bool>(address);
    }
}
