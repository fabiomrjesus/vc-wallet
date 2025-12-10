using System.ComponentModel.DataAnnotations;

namespace VcWallet.Domain.Entities.OnChain;

public class OnChainProposalSignature
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public required string ProposalId { get; set; }

    [Required]
    public required string SignerAddress { get; set; }

    [Required]
    public required string Signature { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
