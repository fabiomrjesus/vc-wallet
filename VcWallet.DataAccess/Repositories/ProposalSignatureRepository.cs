using Microsoft.EntityFrameworkCore;
using VcWallet.Domain.Entities.OffChain;

namespace VcWallet.DataAccess.Repositories;

public class ProposalSignatureRepository
{
    private readonly VcWalletDbContext _db;

    public ProposalSignatureRepository(VcWalletDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(OffChainHubProposalSignature signature, CancellationToken ct = default)
    {
        _db.OffChainHubProposalSignatures.Add(signature);
        await _db.SaveChangesAsync(ct);
    }

    public Task<List<OffChainHubProposalSignature>> GetByProposalIdAsync(Guid proposalId, CancellationToken ct = default)
    {
        return _db.OffChainHubProposalSignatures
            .Where(s => s.ProposalId == proposalId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(ct);
    }
}
