using System.ComponentModel.DataAnnotations;

namespace VcWallet.Domain.Entities.OffChain;

public class OffChainHubProposalSignature
{
    [Key]
    public Guid Id { get; set; }

    public Guid ProposalId { get; set; }

    public Guid SignerUserId { get; set; }
    public VcWalletUser? Signer { get; set; }

    public string? SignerAddress { get; set; }

    public required string Signature { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
