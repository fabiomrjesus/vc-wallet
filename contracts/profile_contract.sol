// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ProfileContract
/// @notice Stores basic user profiles keyed by address.
contract ProfileContract {
    struct Profile {
        string name;
        string recordId;
        string photoId;
    }

    address public owner;
    mapping(address => Profile) private profiles;
    mapping(address => bool) private hasProfile;

    error OnlyOwner();
    error ProfileAlreadyExists(address user);
    error InvalidOwner(address newOwner);

    event ProfileCreated(address indexed user, string name, string photoId);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Transfer contract ownership.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidOwner(newOwner);
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /// @notice Add a new profile for a user address.
    function addProfile(address user, string calldata name, string calldata photoId, string calldata recordId) external onlyOwner {
        if (hasProfile[user]) revert ProfileAlreadyExists(user);
        profiles[user] = Profile({ name: name, photoId: photoId, recordId : recordId });
        hasProfile[user] = true;
        emit ProfileCreated(user, name, photoId);
    }

    /// @notice Fetch a profile by address. Returns empty fields if none exists.
    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }
}
