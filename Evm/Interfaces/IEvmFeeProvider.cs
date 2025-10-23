using Moongy.Labs.VcWallet.Core.Models;
using Moongy.Labs.VcWallet.Evm.Models;
using System.Numerics;

namespace Moongy.Labs.VcWallet.Evm.Interfaces;
public interface IEvmFeeProvider
{
    Task<GasQuote> GetGasQuoteAsync(CancellationToken ct);
    Task<BigInteger> EstimateGasAsync(EvmAddress from, EvmAddress? to, Hex data, BigInteger? valueWei, CancellationToken ct);
}
