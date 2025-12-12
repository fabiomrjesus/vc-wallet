using System.Numerics;

namespace VcWallet.Eth.Contracts.Interfaces;

public record OffchainProposalView(byte ActionType, string Data, string Proposer, ulong CreatedAt, ulong ExecutedAt, bool Executed);

public interface IOffchainSignatureHubService
{
    Task<bool> IsSignerAsync(string address, CancellationToken ct = default);
    Task<string> GetOwnerAsync(CancellationToken ct = default);
    Task<BigInteger> GetSignerCountAsync(CancellationToken ct = default);
    Task<BigInteger> GetQuorumAsync(CancellationToken ct = default);
    Task<BigInteger> GetProposalNonceAsync(CancellationToken ct = default);
    Task<string> GetProposalIdByIndexAsync(BigInteger index, CancellationToken ct = default);
    Task<OffchainProposalView> GetProposalAsync(string proposalId, CancellationToken ct = default);
    Task<bool> AssignCandidateAcceptedAsync(string proposalId, CancellationToken ct = default);
    Task<string> HashProposalAsync(string proposalId, CancellationToken ct = default);
    Task<bool> VerifyOffchainApprovalAsync(string proposalId, IEnumerable<string> signatures, CancellationToken ct = default);
}
