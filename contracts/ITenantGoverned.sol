// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ITenantGoverned
/// @notice Interface for tenant contracts whose structure is managed by TenantGovernanceOffchain.
interface ITenantGoverned {
    function govSetIssuer(address issuer, bool enabled) external;
    function govCreateField(bytes32 fieldId, string calldata label) external;
    function govRevokeField(bytes32 fieldId) external;
    function govCreateSchema(
        bytes32 schemaId,
        string calldata name,
        bytes32[] calldata fieldIds
    ) external;
    function govRevokeSchema(bytes32 schemaId) external;
}
