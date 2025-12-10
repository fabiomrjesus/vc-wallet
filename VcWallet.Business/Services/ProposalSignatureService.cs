using VcWallet.DataAccess.Repositories;
using VcWallet.Domain.Entities.OffChain;

namespace VcWallet.Business.Services;

public class ProposalSignatureService
{
    private readonly ProposalSignatureRepository _repo;

    public ProposalSignatureService(ProposalSignatureRepository repo)
    {
        _repo = repo;
    }

    public async Task<OffChainHubProposalSignature> AddSignatureAsync(Guid proposalId, string signerAddress, string signature, CancellationToken ct = default)
    {
        var entity = new OffChainHubProposalSignature
        {
          Id = Guid.NewGuid(),
          ProposalId = proposalId,
          SignerUserId = Guid.Empty, // placeholder when linking to users is added
          Signature = signature,
          CreatedAt = DateTimeOffset.UtcNow,
          SignerAddress = signerAddress
        };
        await _repo.AddAsync(entity, ct);
        return entity;
    }

    public Task<List<OffChainHubProposalSignature>> GetSignaturesAsync(Guid proposalId, CancellationToken ct = default)
    {
        return _repo.GetByProposalIdAsync(proposalId, ct);
    }
}
