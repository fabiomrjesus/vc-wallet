using Microsoft.EntityFrameworkCore;
using VcWallet.Domain.Entities.OffChain;
using VcWallet.Domain.Entities.OnChain;

namespace VcWallet.Domain.Contexts
{
    public class VcWalletDbContext : DbContext
    {
        public DbSet<OnChainProposalSignature> OnChainSignatures { get; set; }
        public DbSet<OffChainHubProposal> OffChainProposal { get; set; }
        public DbSet<OffChainHubProposalSignature> OffChainProposalSignature { get; set; }
        public DbSet<VcWalletRole> Roles { get; set; }
        public DbSet<VcWalletUser> Users { get; set; }
    }
}
