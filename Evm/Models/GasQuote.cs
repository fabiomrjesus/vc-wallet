using System.Numerics;
namespace Moongy.Labs.VcWallet.Evm.Models;
public record GasQuote(
        BigInteger? LegacyGasPriceGwei,
        BigInteger? MaxFeePerGasGwei,
        BigInteger? MaxPriorityFeePerGasGwei);