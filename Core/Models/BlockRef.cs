using Moongy.Labs.VcWallet.Core.Enums;

namespace Moongy.Labs.VcWallet.Core.Models;
public record BlockRef(BlockRefKind Kind, ulong? Number = null, string? Hash = null);
