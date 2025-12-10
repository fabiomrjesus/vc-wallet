using Microsoft.EntityFrameworkCore;
using VcWallet.Domain.Entities.OffChain;
using VcWallet.Domain.Entities.OnChain;

namespace VcWallet.DataAccess;

public class VcWalletDbContext : DbContext
{
    public VcWalletDbContext(DbContextOptions<VcWalletDbContext> options) : base(options)
    {
    }

    public DbSet<OffChainHubProposalSignature> OffChainHubProposalSignatures => Set<OffChainHubProposalSignature>();
    public DbSet<OnChainProposalSignature> OnChainProposalSignatures => Set<OnChainProposalSignature>();
}
