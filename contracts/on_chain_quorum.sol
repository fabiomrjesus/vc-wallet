// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./quorum_base.sol";

/// @title OnChainQuorum
/// @notice Generic on-chain approvals for proposals keyed by bytes32.
abstract contract OnChainQuorum is QuorumBase {
    mapping(bytes32 => mapping(address => bool)) private _hasApproved;
    mapping(bytes32 => uint256) private _approvalCounts;

    event ProposalApproved(bytes32 indexed proposalId, address indexed approver);

    /// @notice Approve a proposal on-chain.
    function approve(bytes32 proposalId) external {
        if (!_isSigner[msg.sender]) revert InvalidSigner(msg.sender);
        if (_hasApproved[proposalId][msg.sender]) return;

        _hasApproved[proposalId][msg.sender] = true;
        _approvalCounts[proposalId] += 1;
        emit ProposalApproved(proposalId, msg.sender);
    }

    /// @notice Check if a proposal has reached quorum.
    function hasQuorum(bytes32 proposalId) public view returns (bool) {
        if (quorum == 0) return false;
        return _approvalCounts[proposalId] >= quorum;
    }

    /// @notice View whether a signer has approved a proposal.
    function hasApproved(bytes32 proposalId, address signer) external view returns (bool) {
        return _hasApproved[proposalId][signer];
    }

    /// @notice View current approval count for a proposal.
    function approvalCount(bytes32 proposalId) external view returns (uint256) {
        return _approvalCounts[proposalId];
    }
}
