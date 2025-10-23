using Moongy.Labs.VcWallet.Evm.Models;
using System.Numerics;

namespace Moongy.Labs.VcWallet.Evm.Interfaces;
public interface IEvmNonceProvider
{
    Task<BigInteger> GetNextNonceAsync(EvmAddress address, CancellationToken ct);
}
