// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IRoleManaged
/// @notice Generic interface for contracts whose roles are governed by HubGovernance.
interface IRoleManaged {
    /// @notice Set or unset a role for an account.
    /// @dev Only the governance/hub contract should be allowed to call this.
    function setRole(bytes32 roleId, address account, bool enabled) external;
}
