namespace Moongy.Labs.VcWallet.EvmHandler;
public interface IEvmClient
{
    public async Task<SendTransactionResponse> Send(SendTransactionRequest request, CancellationToken cancellationToken);
    public asyc

}
