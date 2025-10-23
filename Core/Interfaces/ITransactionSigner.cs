using Moongy.Labs.VcWallet.Core.Models;

namespace Moongy.Labs.VcWallet.Core.Interfaces;
public interface ITransactionSigner
{
    Task<Hex> SignAsync(byte[] payload, CancellationToken ct);
}
