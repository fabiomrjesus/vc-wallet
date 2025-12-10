// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Off_Chain_Quorum.sol";
import "./IRoleManaged.sol";

/// @title HubGovernanceOffchain
/// @notice Global governance hub using off-chain EIP-712 signatures for approvals.
contract HubGovernanceOffchain is OffChainQuorum {
    enum GlobalActionType {
        AssignSigner,
        RevokeSigner,
        TransferOwnership,
        SetContractRole
    }

    struct GlobalProposal {
        GlobalActionType actionType;
        bytes data;   // encoded payload, meaning depends on actionType
        address proposer;
        uint64 createdAt;
        uint64 executedAt;
        bool executed;
    }

    mapping(bytes32 => GlobalProposal) public proposals;
    mapping(uint256 => bytes32) public proposalIds;
    mapping(bytes32 => bool) public assignCandidateAccepted;
    uint256 public proposalNonce;

    error NotSigner();
    error CannotRemoveOwner();
    error CannotRemoveLastSigner();
    error NotCandidate();
    error InvalidActionType();

    event GlobalProposalCreated(bytes32 indexed proposalId, GlobalActionType actionType, address indexed proposer);
    event GlobalProposalExecuted(bytes32 indexed proposalId);
    event GlobalProposalIndexed(uint256 indexed nonce, bytes32 indexed proposalId, address indexed proposer);

    modifier onlySigner() {
        if (!_isSigner[msg.sender]) revert NotSigner();
        _;
    }

    constructor()
        OffChainQuorum("VCWalletHubGovernance", "1")
    {
        _addSignerInternal(msg.sender);
        _setQuorum(1);                 
    }

    function _removeSignerInternal(address signer) internal override {
        if (signer == owner) revert CannotRemoveOwner();
        if (signerCount == 1) revert CannotRemoveLastSigner();
        super._removeSignerInternal(signer);
    }


    function _buildProposalId(GlobalActionType actionType, bytes memory data)
        internal
        returns (bytes32 proposalId, uint256 nonceUsed)
    {
        nonceUsed = proposalNonce++;
        proposalId = keccak256(abi.encode(actionType, keccak256(data), nonceUsed));
        proposalIds[nonceUsed] = proposalId;
        emit GlobalProposalIndexed(nonceUsed, proposalId, msg.sender);
    }


    function proposeAssignSigner(address candidate)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        require(candidate != address(0), "Zero candidate");
        require(!_isSigner[candidate], "Already signer");

        bytes memory data = abi.encode(candidate);
        (proposalId, ) = _buildProposalId(GlobalActionType.AssignSigner, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.AssignSigner,
            data: data,
            proposer: msg.sender,
            createdAt: uint64(block.timestamp),
            executedAt: 0,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.AssignSigner, msg.sender);
    }

    /// @notice Candidate explicitly accepts becoming a signer.
    function acceptAssignSigner(bytes32 proposalId) external {
        GlobalProposal storage p = proposals[proposalId];
        require(p.actionType == GlobalActionType.AssignSigner, "Not AssignSigner");
        (address candidate) = abi.decode(p.data, (address));
        if (msg.sender != candidate) revert NotCandidate();
        require(!p.executed, "Already executed");
        assignCandidateAccepted[proposalId] = true;
    }

    // ---------- RevokeSigner (quorum, 2-signer owner tiebreaker) ----------

    function proposeRevokeSigner(address signerToRevoke)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        require(_isSigner[signerToRevoke], "Not a signer");
        require(signerToRevoke != owner, "Cannot revoke owner directly");

        bytes memory data = abi.encode(signerToRevoke);
        (proposalId, ) = _buildProposalId(GlobalActionType.RevokeSigner, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.RevokeSigner,
            data: data,
            proposer: msg.sender,
            createdAt: uint64(block.timestamp),
            executedAt: 0,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.RevokeSigner, msg.sender);
    }

    // ---------- TransferOwnership (owner proposes, quorum approves) ----------

    function proposeTransferOwnership(address newOwnerCandidate)
        external
        onlyOwner
        returns (bytes32 proposalId)
    {
        require(newOwnerCandidate != address(0), "Zero address");
        require(_isSigner[newOwnerCandidate], "New owner must be signer");
        require(newOwnerCandidate != owner, "Already owner");

        bytes memory data = abi.encode(newOwnerCandidate);
        (proposalId, ) = _buildProposalId(GlobalActionType.TransferOwnership, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.TransferOwnership,
            data: data,
            proposer: msg.sender,
            createdAt: uint64(block.timestamp),
            executedAt: 0,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.TransferOwnership, msg.sender);
    }

    // ---------- SetContractRole (generic role mgmt: tenant admins, issuer admins, etc.) ----------

    function proposeSetContractRole(
        address targetContract,
        bytes32 roleId,
        address account,
        bool enabled
    ) external onlySigner returns (bytes32 proposalId) {
        require(targetContract != address(0), "Zero contract");
        bytes memory data = abi.encode(targetContract, roleId, account, enabled);
        (proposalId, ) = _buildProposalId(GlobalActionType.SetContractRole, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.SetContractRole,
            data: data,
            proposer: msg.sender,
            createdAt: uint64(block.timestamp),
            executedAt: 0,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.SetContractRole, msg.sender);
    }

    // ---------- Execute proposals (off-chain signatures) ----------

    /// @notice Execute a proposal once off-chain signatures reach quorum.
    /// @param proposalId The proposal to execute.
    /// @param signatures EIP-712 signatures from signers over hashProposal(proposalId).
    function executeProposal(bytes32 proposalId, bytes[] calldata signatures) external {
        require(verifyOffchainApproval(proposalId, signatures), "Quorum not reached");
        GlobalProposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");

        if (p.actionType == GlobalActionType.AssignSigner) {
            _executeAssignSigner(p, proposalId);
        } else if (p.actionType == GlobalActionType.RevokeSigner) {
            _executeRevokeSigner(p);
        } else if (p.actionType == GlobalActionType.TransferOwnership) {
            _executeTransferOwnership(p);
        } else if (p.actionType == GlobalActionType.SetContractRole) {
            _executeSetContractRole(p);
        } else {
            revert InvalidActionType();
        }

        p.executed = true;
        p.executedAt = uint64(block.timestamp);
        emit GlobalProposalExecuted(proposalId);
    }

    function _executeAssignSigner(GlobalProposal storage p, bytes32 proposalId) internal {
        require(assignCandidateAccepted[proposalId], "Candidate not accepted");
        (address candidate) = abi.decode(p.data, (address));
        _addSignerInternal(candidate);
    }

    function _executeRevokeSigner(GlobalProposal storage p) internal {
        (address target) = abi.decode(p.data, (address));
        require(target != owner, "Owner cannot be revoked via proposal");

        if (signerCount == 2) {
            require(msg.sender == owner, "Only owner can break 2-signer deadlock");
        }

        _removeSignerInternal(target);
    }

    function _executeTransferOwnership(GlobalProposal storage p) internal {
        (address newOwnerCandidate) = abi.decode(p.data, (address));
        require(_isSigner[newOwnerCandidate], "New owner must be signer");
        address oldOwner = owner;
        owner = newOwnerCandidate;
        emit OwnerChanged(oldOwner, newOwnerCandidate);
    }

    function _executeSetContractRole(GlobalProposal storage p) internal {
        (address targetContract, bytes32 roleId, address account, bool enabled) =
            abi.decode(p.data, (address, bytes32, address, bool));

        IRoleManaged(targetContract).setRole(roleId, account, enabled);
    }
}
