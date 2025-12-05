// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Off_Chain_Quorum.sol";
import "./ITenantGoverned.sol";

/// @title TenantGovernanceOffchain
/// @notice Off-chain quorum governance for a single tenant contract.
contract TenantGovernanceOffchain is OffChainQuorum {
    enum TenantActionType {
        SetIssuer,
        CreateField,
        RevokeField,
        CreateSchema,
        RevokeSchema
    }

    struct TenantProposal {
        TenantActionType actionType;
        bytes data;    // encoded parameters
        bool executed;
    }

    ITenantGoverned public tenant;
    mapping(bytes32 => TenantProposal) public proposals;
    uint256 public proposalNonce;

    error NotSigner();
    error InvalidActionType();

    event TenantProposalCreated(bytes32 indexed proposalId, TenantActionType actionType);
    event TenantProposalExecuted(bytes32 indexed proposalId);

    modifier onlySigner() {
        if (!_isSigner[msg.sender]) revert NotSigner();
        _;
    }

    constructor(address tenantContract)
        OffChainQuorum("VCWalletTenantGovernance", "1")
    {
        require(tenantContract != address(0), "Zero tenant");
        tenant = ITenantGoverned(tenantContract);

        // bootstrap: deployer is first signer, 1-of-1 quorum
        _addSignerInternal(msg.sender);
        _setQuorum(1);
    }

    // ---------- Proposal ID helper ----------

    function _buildProposalId(TenantActionType actionType, bytes memory data)
        internal
        returns (bytes32)
    {
        return keccak256(abi.encode(actionType, keccak256(data), proposalNonce++));
    }

    // ---------- Propose tenant-level structural changes ----------

    function proposeSetIssuer(address issuer, bool enabled)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(issuer, enabled);
        proposalId = _buildProposalId(TenantActionType.SetIssuer, data);
        proposals[proposalId] = TenantProposal({
            actionType: TenantActionType.SetIssuer,
            data: data,
            executed: false
        });
        emit TenantProposalCreated(proposalId, TenantActionType.SetIssuer);
    }

    function proposeCreateField(bytes32 fieldId, string calldata label)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(fieldId, label);
        proposalId = _buildProposalId(TenantActionType.CreateField, data);
        proposals[proposalId] = TenantProposal({
            actionType: TenantActionType.CreateField,
            data: data,
            executed: false
        });
        emit TenantProposalCreated(proposalId, TenantActionType.CreateField);
    }

    function proposeRevokeField(bytes32 fieldId)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(fieldId);
        proposalId = _buildProposalId(TenantActionType.RevokeField, data);
        proposals[proposalId] = TenantProposal({
            actionType: TenantActionType.RevokeField,
            data: data,
            executed: false
        });
        emit TenantProposalCreated(proposalId, TenantActionType.RevokeField);
    }

    function proposeCreateSchema(
        bytes32 schemaId,
        string calldata name,
        bytes32[] calldata fieldIds
    ) external onlySigner returns (bytes32 proposalId) {
        bytes memory data = abi.encode(schemaId, name, fieldIds);
        proposalId = _buildProposalId(TenantActionType.CreateSchema, data);
        proposals[proposalId] = TenantProposal({
            actionType: TenantActionType.CreateSchema,
            data: data,
            executed: false
        });
        emit TenantProposalCreated(proposalId, TenantActionType.CreateSchema);
    }

    function proposeRevokeSchema(bytes32 schemaId)
        external
        onlySigner
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(schemaId);
        proposalId = _buildProposalId(TenantActionType.RevokeSchema, data);
        proposals[proposalId] = TenantProposal({
            actionType: TenantActionType.RevokeSchema,
            data: data,
            executed: false
        });
        emit TenantProposalCreated(proposalId, TenantActionType.RevokeSchema);
    }

    // ---------- Execute tenant proposals (off-chain signatures) ----------

    /// @notice Execute a tenant proposal once off-chain signatures reach quorum.
    /// @param proposalId proposal to execute.
    /// @param signatures EIP-712 signatures from tenant signers over hashProposal(proposalId).
    function executeTenantProposal(bytes32 proposalId, bytes[] calldata signatures) external {
        require(verifyOffchainApproval(proposalId, signatures), "Tenant quorum not reached");
        TenantProposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");

        if (p.actionType == TenantActionType.SetIssuer) {
            (address issuer, bool enabled) = abi.decode(p.data, (address, bool));
            tenant.govSetIssuer(issuer, enabled);
        } else if (p.actionType == TenantActionType.CreateField) {
            (bytes32 fieldId, string memory label) =
                abi.decode(p.data, (bytes32, string));
            tenant.govCreateField(fieldId, label);
        } else if (p.actionType == TenantActionType.RevokeField) {
            (bytes32 fieldId) = abi.decode(p.data, (bytes32));
            tenant.govRevokeField(fieldId);
        } else if (p.actionType == TenantActionType.CreateSchema) {
            (bytes32 schemaId, string memory name, bytes32[] memory fieldIds) =
                abi.decode(p.data, (bytes32, string, bytes32[]));
            tenant.govCreateSchema(schemaId, name, fieldIds);
        } else if (p.actionType == TenantActionType.RevokeSchema) {
            (bytes32 schemaId) = abi.decode(p.data, (bytes32));
            tenant.govRevokeSchema(schemaId);
        } else {
            revert InvalidActionType();
        }

        p.executed = true;
        emit TenantProposalExecuted(proposalId);
    }
}
