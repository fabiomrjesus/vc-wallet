// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VcTenants
/// @notice Registry for wallet tenants with admin role management.
contract VcTenants {

    enum TenantState {
        Pending,
        Active,
        Admin,
        Revoked
    }

    struct Tenant {
        bytes32 key;
        bytes32 hash;
        TenantState state;
    }

    mapping(address=>Tenant) private _tenants;
    mapping(address=>bool) public _isTenant;
    mapping(address=>bool) public _isActiveTenant;
    mapping(address=>bool) private _isAdmin;


    error OnlyAdmin();
    error TenantAlreadyExists(address tenantAddress);
    error TenantNotFound(address tenantAddress);
    error InvalidAdmin(address admin);

    modifier onlyAdmin() {
        if (!_isAdmin[msg.sender]) revert OnlyAdmin();
        _;
    }

    modifier onlyActiveTenant() {
        if (!_isTenant[msg.sender]) revert OnlyAdmin();
        _;
    }
}
