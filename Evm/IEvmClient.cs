using Moongy.Labs.VcWallet.Core.Interfaces;
using Moongy.Labs.VcWallet.Core.Models;
using Moongy.Labs.VcWallet.Evm.Models;
using System.Numerics;

namespace Moongy.Labs.VcWallet.Evm;
public interface IEvmClient : IBlockchainDataFetcher, ITransactionBroadcaster
{
    ChainId ChainId { get; }

    Task<BigInteger> GetBalanceWeiAsync(EvmAddress address, BlockRef at, CancellationToken ct);
    Task<BigInteger> GetNonceAsync(EvmAddress address, CancellationToken ct);

    Task<Hex> CallAsync(EvmAddress to, Hex data, BlockRef at, CancellationToken ct);
    Task<byte[]> BuildTransactionAsync(
        EvmAddress from,
        EvmAddress? to,
        BigInteger? valueWei,
        Hex data,
        BigInteger gasLimit,
        GasQuote gas,
        BigInteger nonce,
        CancellationToken ct);
    Task<Hex> SignTransactionAsync(byte[] rlpUnsignedTx, ITransactionSigner signer, CancellationToken ct);
    Task<TxId> SendRawTransactionAsync(Hex signedTx, CancellationToken ct);
    Task<Hex?> GetTransactionReceiptAsync(TxId txId, CancellationToken ct);
    Task<IReadOnlyList<Hex>> GetLogsAsync(LogFilter filter, CancellationToken ct);
}
