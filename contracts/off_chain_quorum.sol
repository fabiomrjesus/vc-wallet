// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./quorum_base.sol";

/// @title OffChainQuorum
/// @notice Verifies EIP-712 signatures from signers over a proposalId.
abstract contract OffChainQuorum is QuorumBase {
    bytes32 private constant EIP712_DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant PROPOSAL_TYPEHASH =
        keccak256("Proposal(bytes32 proposalId)");
    bytes32 private constant _MALLEABILITY_BOUND =
        0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;

    bytes32 private immutable _domainSeparator;

    error InvalidSignatureLength();
    error InvalidSignatureS();
    error InvalidSignatureV();

    constructor(string memory name, string memory version) {
        _domainSeparator = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256(bytes(name)),
                keccak256(bytes(version)),
                block.chainid,
                address(this)
            )
        );
    }

    /// @notice Hash a proposalId into an EIP-712 digest.
    function hashProposal(bytes32 proposalId) public view returns (bytes32) {
        bytes32 structHash = keccak256(abi.encode(PROPOSAL_TYPEHASH, proposalId));
        return keccak256(abi.encodePacked("\x19\x01", _domainSeparator, structHash));
    }

    /// @notice Check if signatures from signers reach quorum for proposalId.
    function verifyOffchainApproval(bytes32 proposalId, bytes[] calldata signatures)
        public
        view
        returns (bool)
    {
        if (quorum == 0 || signatures.length == 0) return false;
        bytes32 digest = hashProposal(proposalId);

        uint256 approvals;
        address[] memory seenSigners = new address[](signatures.length);

        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = _recoverSigner(digest, signatures[i]);
            if (!_isSigner[signer]) continue;

            bool duplicate;
            for (uint256 j = 0; j < approvals; j++) {
                if (seenSigners[j] == signer) {
                    duplicate = true;
                    break;
                }
            }
            if (duplicate) continue;

            seenSigners[approvals] = signer;
            approvals += 1;
            if (approvals >= quorum) return true;
        }

        return false;
    }

    function _recoverSigner(bytes32 digest, bytes memory signature)
        internal
        pure
        returns (address)
    {
        if (signature.length != 65) revert InvalidSignatureLength();
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
        if (uint256(s) > uint256(_MALLEABILITY_BOUND)) revert InvalidSignatureS();
        if (v != 27 && v != 28) revert InvalidSignatureV();
        return ecrecover(digest, v, r, s);
    }
}
