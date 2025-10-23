using Moongy.Labs.VcWallet.Core.Enums;
using Moongy.Labs.VcWallet.Core.Models;

namespace Moongy.Labs.VcWallet.Core.Interfaces;
public interface IBlockchainDataFetcher
{
    Task<ulong> GetBestBlockNumberAsync(CancellationToken ct);
    Task<string> GetBlockHashAsync(ulong height, CancellationToken ct);
    Task<TxStatus> GetTransactionStatusAsync(TxId txId, CancellationToken ct);
}
