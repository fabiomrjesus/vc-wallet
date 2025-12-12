using VcWallet.DataAccess.Repositories;
using VcWallet.Domain.Entities.OffChain;

namespace VcWallet.Business.Queries;

public record GetOffChainProposalSignaturesQuery(string ProposalId);

public class GetOffChainProposalSignaturesQueryHandler
{
    private readonly OffChainProposalSignatureRepository _repository;

    public GetOffChainProposalSignaturesQueryHandler(OffChainProposalSignatureRepository repository)
    {
        _repository = repository;
    }

    public Task<List<OffChainHubProposalSignature>> Handle(GetOffChainProposalSignaturesQuery query, CancellationToken ct = default)
    {
        return _repository.GetByProposalIdAsync(query.ProposalId, ct);
    }
}
