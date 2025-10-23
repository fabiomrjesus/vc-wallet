namespace Moongy.Labs.VcWallet.Evm.Models;
public record LogFilter(
        EvmAddress? Address,
        IEnumerable<string>? Topics,
        BlockRef FromBlock,
        BlockRef ToBlock);