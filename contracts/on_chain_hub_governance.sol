// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./on_chain_quorum.sol";
import "./IRoleManaged.sol";

/// @title HubGovernance
/// @notice Global governance hub for signers and contract roles.
contract HubGovernance is OnChainQuorum {
    enum GlobalActionType {
        AssignSigner,
        RevokeSigner,
        TransferOwnership,
        SetContractRole
    }

    struct GlobalProposal {
        GlobalActionType actionType;
        bytes data;   // encoded payload, meaning depends on actionType
        bool executed;
    }

    mapping(bytes32 => GlobalProposal) public proposals;
    mapping(bytes32 => bool) public assignCandidateAccepted;

    uint256 public proposalNonce;

    error NotSigner();
    error CannotRemoveOwner();
    error CannotRemoveLastSigner();
    error NotCandidate();
    error InvalidActionType();

    event GlobalProposalCreated(bytes32 indexed proposalId, GlobalActionType actionType);
    event GlobalProposalExecuted(bytes32 indexed proposalId);

    modifier onlySigner() {
        if (!_isSigner[msg.sender]) revert NotSigner();
        _;
    }

    constructor() {
        // base constructor sets owner = msg.sender, quorum = 0
        // bootstrap: owner is first signer, quorum = 1-of-1
        _addSignerInternal(msg.sender);
        _setQuorum(1);
    }

    // ---------- Invariant tweaks on signer removal ----------

    /// @dev Override to enforce: owner cannot be removed; last signer cannot be removed.
    function _removeSignerInternal(address signer) internal override {
        if (signer == owner) revert CannotRemoveOwner();
        if (signerCount == 1) revert CannotRemoveLastSigner();
        super._removeSignerInternal(signer);
    }

    // ---------- Proposal ID helper ----------

    function _buildProposalId(GlobalActionType actionType, bytes memory data)
        internal
        returns (bytes32)
    {
        return keccak256(abi.encode(actionType, keccak256(data), proposalNonce++));
    }

    // ---------- AssignSigner (quorum + handshake) ----------

    /// @notice Create a proposal to assign a new signer.
    /// @dev Any existing signer can propose.
    function proposeAssignSigner(address candidate)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        require(candidate != address(0), "Zero candidate");
        require(!_isSigner[candidate], "Already signer");

        bytes memory data = abi.encode(candidate);
        proposalId = _buildProposalId(GlobalActionType.AssignSigner, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.AssignSigner,
            data: data,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.AssignSigner);
    }

    /// @notice Candidate explicitly accepts becoming a signer (handshake).
    function acceptAssignSigner(bytes32 proposalId) external {
        GlobalProposal storage p = proposals[proposalId];
        require(p.actionType == GlobalActionType.AssignSigner, "Not AssignSigner");
        (address candidate) = abi.decode(p.data, (address));
        if (msg.sender != candidate) revert NotCandidate();
        require(!p.executed, "Already executed");
        assignCandidateAccepted[proposalId] = true;
    }

    // ---------- RevokeSigner (quorum, 2-signer tiebreaker) ----------

    /// @notice Create a proposal to revoke a signer (except owner).
    function proposeRevokeSigner(address signerToRevoke)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        require(_isSigner[signerToRevoke], "Not a signer");
        require(signerToRevoke != owner, "Cannot revoke owner directly");

        bytes memory data = abi.encode(signerToRevoke);
        proposalId = _buildProposalId(GlobalActionType.RevokeSigner, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.RevokeSigner,
            data: data,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.RevokeSigner);
    }

    // ---------- TransferOwnership (owner proposes, quorum approves) ----------

    /// @notice Owner proposes to transfer ownership to another signer.
    function proposeTransferOwnership(address newOwnerCandidate)
        external
        onlyOwner
        returns (bytes32 proposalId)
    {
        require(newOwnerCandidate != address(0), "Zero address");
        require(_isSigner[newOwnerCandidate], "New owner must be signer");
        require(newOwnerCandidate != owner, "Already owner");

        bytes memory data = abi.encode(newOwnerCandidate);
        proposalId = _buildProposalId(GlobalActionType.TransferOwnership, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.TransferOwnership,
            data: data,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.TransferOwnership);
    }

    // ---------- SetContractRole (generic role management) ----------

    /// @notice Propose to set/unset a role on a target contract.
    /// @dev targetContract must implement IRoleManaged.
    function proposeSetContractRole(
        address targetContract,
        bytes32 roleId,
        address account,
        bool enabled
    ) external onlySigner returns (bytes32 proposalId) {
        require(targetContract != address(0), "Zero contract");
        bytes memory data = abi.encode(targetContract, roleId, account, enabled);
        proposalId = _buildProposalId(GlobalActionType.SetContractRole, data);

        proposals[proposalId] = GlobalProposal({
            actionType: GlobalActionType.SetContractRole,
            data: data,
            executed: false
        });

        emit GlobalProposalCreated(proposalId, GlobalActionType.SetContractRole);
    }

    // ---------- Execute proposals ----------

    /// @notice Execute a proposal that has reached quorum.
    function executeProposal(bytes32 proposalId) external {
        require(hasQuorum(proposalId), "Quorum not reached");
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

        // Two-signers edge case: only owner may execute revocation.
        if (signerCount == 2) {
            require(msg.sender == owner, "Only owner can break 2-signer deadlock");
        }

        _removeSignerInternal(target); // internal already prevents last-signer removal
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
