// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title QuorumBase
/// @notice Generic signer + quorum management.
/// @dev Does NOT know about proposals, tenants, issuers, etc.
abstract contract QuorumBase {
    mapping(address => bool) internal _isSigner;
    uint256 public signerCount;
    uint256 public quorum;
    address public owner;

    error OnlyOwner();
    error InvalidSigner(address signer);
    error QuorumTooHigh(uint256 requested, uint256 available);

    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);
    event QuorumUpdated(uint256 quorum);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event QuorumEnforced(uint256 quorum);

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
        quorum = 0;
    }

    // ---------- External bootstrap / emergency API ----------

    /// @notice Add a signer via owner-only path (bootstrap/emergency).
    function addSigner(address signer) external onlyOwner {
        _addSignerInternal(signer);
    }

    /// @notice Remove a signer via owner-only path (bootstrap/emergency).
    function removeSigner(address signer) external onlyOwner {
        _removeSignerInternal(signer);
    }

    /// @notice Set quorum via owner-only path (bootstrap/emergency).
    function setQuorum(uint256 newQuorum) external onlyOwner {
        _setQuorum(newQuorum);
    }

    /// @notice Transfer ownership. Concrete contracts may restrict this further.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidSigner(newOwner);
        address old = owner;
        owner = newOwner;
        emit OwnerChanged(old, newOwner);
    }

    // ---------- Internal helpers for governance modules ----------

    /// @dev Internal addSigner logic, overrideable for extra invariants.
    function _addSignerInternal(address signer) internal virtual {
        if (signer == address(0)) revert InvalidSigner(signer);
        if (_isSigner[signer]) return;
        _isSigner[signer] = true;
        signerCount += 1;
        emit SignerAdded(signer);
        _enforceQuorum();
    }

    /// @dev Internal removeSigner logic, overrideable for extra invariants.
    function _removeSignerInternal(address signer) internal virtual {
        if (!_isSigner[signer]) return;
        _isSigner[signer] = false;
        signerCount -= 1;
        emit SignerRemoved(signer);
        _enforceQuorum();
    }

    /// @dev Internal setQuorum logic, overrideable if needed.
    function _setQuorum(uint256 newQuorum) internal virtual {
        if (signerCount == 0) {
            // with 0 signers, only 0 quorum makes sense
            if (newQuorum != 0) revert QuorumTooHigh(newQuorum, signerCount);
        } else if (newQuorum == 0 || newQuorum > signerCount) {
            // disallow 0 (no proposal can ever pass) and > signerCount
            revert QuorumTooHigh(newQuorum, signerCount);
        }
        quorum = newQuorum;
        emit QuorumUpdated(newQuorum);
    }

    /// @dev Clamp quorum down if signers were removed.
    function _enforceQuorum() internal virtual {
        if (quorum > signerCount) {
            quorum = signerCount;
            emit QuorumEnforced(quorum);
        }
    }

    /// @notice Check if an address is currently a signer.
    function isSigner(address signer) external view returns (bool) {
        return _isSigner[signer];
    }
}
