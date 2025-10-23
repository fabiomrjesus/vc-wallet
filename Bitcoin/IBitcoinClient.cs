using Moongy.Labs.VcWallet.Bitcoin.Models;
using Moongy.Labs.VcWallet.Core.Interfaces;
using Moongy.Labs.VcWallet.Core.Models;

namespace Moongy.Labs.VcWallet.Bitcoin;
public interface IBitcoinClient : IBlockchainDataFetcher, ITransactionBroadcaster
{
    BitcoinNetwork Network { get; }
    Task<BtcPartiallySignedBitcoinTransactions> BuildPartiallySignedBitcoinTransactionsAsync(
            BtcAddress from,
            IDictionary<BtcAddress, long> to,
            long? explicitFeeSatoshi, 
            decimal? feeRateSatPerVByte,
            CancellationToken ct);
    Task<BtcPartiallySignedBitcoinTransactions> SignPartiallySignedBitcoinTransactionsAsync(BtcPartiallySignedBitcoinTransactions PartiallySignedBitcoinTransactions, ITransactionSigner signer, CancellationToken ct);
    Task<Hex> FinalizePartiallySignedBitcoinTransactionsAsync(BtcPartiallySignedBitcoinTransactions PartiallySignedBitcoinTransactions, CancellationToken ct);
    Task<Hex?> GetMerkleProofAsync(TxId txId, CancellationToken ct);
}
