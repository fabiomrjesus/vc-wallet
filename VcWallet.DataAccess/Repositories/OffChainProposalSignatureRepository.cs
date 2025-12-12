using Microsoft.EntityFrameworkCore;
using VcWallet.Domain.Contexts;
using VcWallet.Domain.Entities.OffChain;

namespace VcWallet.DataAccess.Repositories;

public class OffChainProposalSignatureRepository
{
    private readonly VcWalletDbContext _db;

    public OffChainProposalSignatureRepository(VcWalletDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(OffChainHubProposalSignature signature, CancellationToken ct = default)
    {
        _db.OffChainHubProposalSignatures.Add(signature);
        await _db.SaveChangesAsync(ct);
    }

    public Task<bool> HasSignatureAsync(string proposalId, string signerAddress, CancellationToken ct = default)
    {
        return _db.OffChainHubProposalSignatures
            .AnyAsync(s => s.ProposalId == proposalId && s.SignerAddress != null && s.SignerAddress.ToLower() == signerAddress.ToLower(), ct);
    }

    public Task<List<OffChainHubProposalSignature>> GetByProposalIdAsync(string proposalId, CancellationToken ct = default)
    {
        return _db.OffChainHubProposalSignatures
            .Where(s => s.ProposalId == proposalId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(ct);
    }
}
