using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VcWallet.Domain.Entities.OffChain;
using VcWallet.Domain.Entities.OnChain;

namespace VcWallet.Domain.Contexts;

public class VcWalletDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
{
    public VcWalletDbContext(DbContextOptions<VcWalletDbContext> options) : base(options)
    {
    }

    public DbSet<OnChainProposalSignature> OnChainProposalSignatures => Set<OnChainProposalSignature>();
    public DbSet<OffChainHubProposal> OffChainHubProposals => Set<OffChainHubProposal>();
    public DbSet<OffChainHubProposalSignature> OffChainHubProposalSignatures => Set<OffChainHubProposalSignature>();
    public DbSet<VcWalletRole> WalletRoles => Set<VcWalletRole>();
    public DbSet<VcWalletUser> WalletUsers => Set<VcWalletUser>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
