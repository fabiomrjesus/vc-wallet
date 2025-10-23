namespace Moongy.Labs.VcWallet.Bitcoin.Interfaces;
public interface IBitcoinUtxoProvider
{
    Task<IReadOnlyList<BtcUtxo>> GetUtxosAsync(BtcAddress address, CancellationToken ct);
    Task<long> GetBalanceAsync(BtcAddress address, bool confirmedOnly, CancellationToken ct);
}
