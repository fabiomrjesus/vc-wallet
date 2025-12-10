using System.ComponentModel.DataAnnotations;
using VcWallet.Domain.Enums;

namespace VcWallet.Domain.Entities.OffChain;

public class OffChainHubProposal
{
    [Key]
    public Guid Id { get; set; }

    public HubProposalType Type { get; set; }

    public string? Data { get; set; }

    public Guid ProposerId { get; set; }
    public VcWalletUser? Proposer { get; set; }

    public bool Executed { get; set; }

    public ICollection<OffChainHubProposalSignature> Signatures { get; set; } = [];
}
