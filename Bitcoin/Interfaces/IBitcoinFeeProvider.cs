using Moongy.Labs.VcWallet.Bitcoin.Models;

namespace Moongy.Labs.VcWallet.Bitcoin.Interfaces;
public interface IBitcoinFeeProvider
{
    Task<FeeQuote> GetFeeRateSatPerVByteAsync(CancellationToken ct);
}
