using System.Numerics;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using VcWallet.Eth.Contracts.Interfaces;

namespace VcWallet.Eth.Contracts.Services;

public class OffchainSignatureHubService : IOffchainSignatureHubService
{
    private readonly Web3 _web3;
    private readonly Nethereum.Contracts.Function _isSignerFunction;
    private readonly Nethereum.Contracts.Function _ownerFunction;
    private readonly Nethereum.Contracts.Function _signerCountFunction;
    private readonly Nethereum.Contracts.Function _quorumFunction;
    private readonly Nethereum.Contracts.Function _proposalNonceFunction;
    private readonly Nethereum.Contracts.Function _proposalIdsFunction;
    private readonly Nethereum.Contracts.Function _proposalsFunction;
    private readonly Nethereum.Contracts.Function _assignCandidateAcceptedFunction;
    private readonly Nethereum.Contracts.Function _hashProposalFunction;
    private readonly Nethereum.Contracts.Function _verifyOffchainApprovalFunction;

    private const string FullAbi =
        """
        [
          {"inputs":[{"internalType":"address","name":"signer","type":"address"}],"name":"isSigner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
          {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
          {"inputs":[],"name":"signerCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
          {"inputs":[],"name":"quorum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
          {"inputs":[],"name":"proposalNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
          {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposalIds","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
          {"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"hashProposal","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
          {"inputs":[{"internalType":"bytes32","name":"proposalId","type":"bytes32"}],"name":"assignCandidateAccepted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
          {"inputs":[{"internalType":"bytes32","name":"proposalId","type":"bytes32"}],"name":"proposals","outputs":[{"internalType":"uint8","name":"actionType","type":"uint8"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"uint64","name":"createdAt","type":"uint64"},{"internalType":"uint64","name":"executedAt","type":"uint64"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},
          {"inputs":[{"internalType":"bytes32","name":"proposalId","type":"bytes32"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"verifyOffchainApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
        ]
        """;

    public OffchainSignatureHubService(IContractOptions<OffchainSignatureHubService> options)
    {
        if (string.IsNullOrWhiteSpace(options.RpcUrl))
            throw new ArgumentException("RpcUrl is required for OffchainSignatureHubService", nameof(options));
        if (string.IsNullOrWhiteSpace(options.Address))
            throw new ArgumentException("Address is required for OffchainSignatureHubService", nameof(options));

        _web3 = new Web3(options.RpcUrl);
        var contract = _web3.Eth.GetContract(FullAbi, options.Address);
        _isSignerFunction = contract.GetFunction("isSigner");
        _ownerFunction = contract.GetFunction("owner");
        _signerCountFunction = contract.GetFunction("signerCount");
        _quorumFunction = contract.GetFunction("quorum");
        _proposalNonceFunction = contract.GetFunction("proposalNonce");
        _proposalIdsFunction = contract.GetFunction("proposalIds");
        _proposalsFunction = contract.GetFunction("proposals");
        _assignCandidateAcceptedFunction = contract.GetFunction("assignCandidateAccepted");
        _hashProposalFunction = contract.GetFunction("hashProposal");
        _verifyOffchainApprovalFunction = contract.GetFunction("verifyOffchainApproval");
    }

    public Task<bool> IsSignerAsync(string address, CancellationToken ct = default) =>
        _isSignerFunction.CallAsync<bool>(address);

    public Task<string> GetOwnerAsync(CancellationToken ct = default) =>
        _ownerFunction.CallAsync<string>();

    public Task<BigInteger> GetSignerCountAsync(CancellationToken ct = default) =>
        _signerCountFunction.CallAsync<BigInteger>();

    public Task<BigInteger> GetQuorumAsync(CancellationToken ct = default) =>
        _quorumFunction.CallAsync<BigInteger>();

    public Task<BigInteger> GetProposalNonceAsync(CancellationToken ct = default) =>
        _proposalNonceFunction.CallAsync<BigInteger>();

    public Task<string> GetProposalIdByIndexAsync(BigInteger index, CancellationToken ct = default) =>
        _proposalIdsFunction.CallAsync<string>(index);

    public async Task<OffchainProposalView> GetProposalAsync(string proposalId, CancellationToken ct = default)
    {
        var result = await _proposalsFunction.CallDeserializingToObjectAsync<ProposalOutputDTO>(proposalId);
        return new OffchainProposalView(result.ActionType, result.Data, result.Proposer, result.CreatedAt, result.ExecutedAt, result.Executed);
    }

    public Task<bool> AssignCandidateAcceptedAsync(string proposalId, CancellationToken ct = default) =>
        _assignCandidateAcceptedFunction.CallAsync<bool>(proposalId);

    public Task<string> HashProposalAsync(string proposalId, CancellationToken ct = default) =>
        _hashProposalFunction.CallAsync<string>(proposalId);

    public Task<bool> VerifyOffchainApprovalAsync(string proposalId, IEnumerable<string> signatures, CancellationToken ct = default) =>
        _verifyOffchainApprovalFunction.CallAsync<bool>(proposalId, signatures.ToArray());

    [FunctionOutput]
    private class ProposalOutputDTO : IFunctionOutputDTO
    {
        [Parameter("uint8", "actionType", 1)] public byte ActionType { get; set; }
        [Parameter("bytes", "data", 2)] public string Data { get; set; } = string.Empty;
        [Parameter("address", "proposer", 3)] public string Proposer { get; set; } = string.Empty;
        [Parameter("uint64", "createdAt", 4)] public ulong CreatedAt { get; set; }
        [Parameter("uint64", "executedAt", 5)] public ulong ExecutedAt { get; set; }
        [Parameter("bool", "executed", 6)] public bool Executed { get; set; }
    }
}
