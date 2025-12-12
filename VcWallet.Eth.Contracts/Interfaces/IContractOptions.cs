namespace VcWallet.Eth.Contracts.Interfaces;

public interface IContractOptions<T>
{
    public string RpcUrl { get; set; }
    public string Address { get; set; }
}
