using Moongy.Labs.VcWallet.Core.Models;

namespace Moongy.Labs.VcWallet.Core.Interfaces;
public interface ITransactionBroadcaster
{
    Task<string> BroadcastRawTransactionAsync(Hex rawTx, CancellationToken ct);
}
