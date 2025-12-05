contract TenantContract is IRoleManaged {
    // --- existing stuff omitted for brevity ---

    // Tenant-level admins and local quorum
    mapping(address => bool) public isTenantAdmin;
    uint256 public tenantAdminCount;
    uint256 public tenantQuorum; // e.g. must be >= 1 and <= tenantAdminCount

    // Tenant-local governance over issuers/fields/schemas
    enum TenantActionType {
        SetIssuer,
        CreateField,
        RevokeField,
        CreateSchema,
        RevokeSchema
    }

    struct TenantProposal {
        TenantActionType actionType;
        bytes data;   // encoded parameters
        bool executed;
    }

    mapping(bytes32 => TenantProposal) public tenantProposals;
    mapping(bytes32 => mapping(address => bool)) public tenantHasApproved;
    mapping(bytes32 => uint256) public tenantApprovalCount;
    uint256 public tenantProposalNonce;

    modifier onlyTenantAdmin() {
        require(isTenantAdmin[msg.sender], "Not tenant admin");
        _;
    }

    // ----------------- constructor -----------------

    constructor(address _globalGovernance, address[] memory initialTenantAdmins) {
        require(_globalGovernance != address(0), "Zero governance");
        globalGovernance = _globalGovernance;

        for (uint256 i = 0; i < initialTenantAdmins.length; i++) {
            _setTenantAdmin(initialTenantAdmins[i], true);
        }

        // simple default: 1-of-N (you can tighten this later via hub role)
        if (tenantAdminCount > 0) {
            tenantQuorum = 1;
        }
    }

    // ----------------- tenant admin & quorum helpers -----------------

    function _setTenantAdmin(address admin, bool enabled) internal {
        if (enabled) {
            if (!isTenantAdmin[admin]) {
                isTenantAdmin[admin] = true;
                tenantAdminCount += 1;
            }
        } else {
            if (isTenantAdmin[admin]) {
                isTenantAdmin[admin] = false;
                tenantAdminCount -= 1;
            }
        }
        emit TenantAdminSet(admin, enabled);

        // keep quorum sane: clamp down if needed
        if (tenantQuorum > tenantAdminCount) {
            tenantQuorum = tenantAdminCount;
        }
    }

    /// @notice Set tenant quorum (called by global governance via ROLE_TENANT_ADMIN if you want).
    function setTenantQuorum(uint256 newQuorum) external onlyTenantAdmin {
        require(tenantAdminCount > 0, "No admins");
        require(newQuorum > 0 && newQuorum <= tenantAdminCount, "Invalid quorum");
        tenantQuorum = newQuorum;
    }

    function _buildTenantProposalId(TenantActionType actionType, bytes memory data)
        internal
        returns (bytes32)
    {
        return keccak256(abi.encode(actionType, keccak256(data), tenantProposalNonce++));
    }

    // ----------------- proposing structural changes -----------------

    // Issuers

    function proposeSetIssuer(address issuer, bool enabled)
        external
        onlyTenantAdmin
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(issuer, enabled);
        proposalId = _buildTenantProposalId(TenantActionType.SetIssuer, data);
        tenantProposals[proposalId] = TenantProposal({
            actionType: TenantActionType.SetIssuer,
            data: data,
            executed: false
        });
    }

    // Fields

    function proposeCreateField(bytes32 fieldId, string calldata label)
        external
        onlyTenantAdmin
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(fieldId, label);
        proposalId = _buildTenantProposalId(TenantActionType.CreateField, data);
        tenantProposals[proposalId] = TenantProposal({
            actionType: TenantActionType.CreateField,
            data: data,
            executed: false
        });
    }

    function proposeRevokeField(bytes32 fieldId)
        external
        onlyTenantAdmin
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(fieldId);
        proposalId = _buildTenantProposalId(TenantActionType.RevokeField, data);
        tenantProposals[proposalId] = TenantProposal({
            actionType: TenantActionType.RevokeField,
            data: data,
            executed: false
        });
    }

    // Schemas

    function proposeCreateSchema(
        bytes32 schemaId,
        string calldata name,
        bytes32[] calldata fieldIds
    ) external onlyTenantAdmin returns (bytes32 proposalId) {
        bytes memory data = abi.encode(schemaId, name, fieldIds);
        proposalId = _buildTenantProposalId(TenantActionType.CreateSchema, data);
        tenantProposals[proposalId] = TenantProposal({
            actionType: TenantActionType.CreateSchema,
            data: data,
            executed: false
        });
    }

    function proposeRevokeSchema(bytes32 schemaId)
        external
        onlyTenantAdmin
        returns (bytes32 proposalId)
    {
        bytes memory data = abi.encode(schemaId);
        proposalId = _buildTenantProposalId(TenantActionType.RevokeSchema, data);
        tenantProposals[proposalId] = TenantProposal({
            actionType: TenantActionType.RevokeSchema,
            data: data,
            executed: false
        });
    }

    // ----------------- approvals & execution -----------------

    /// @notice Tenant admin approves a tenant-level proposal.
    function tenantApprove(bytes32 proposalId) external onlyTenantAdmin {
        if (tenantHasApproved[proposalId][msg.sender]) return;
        tenantHasApproved[proposalId][msg.sender] = true;
        tenantApprovalCount[proposalId] += 1;
    }

    function _tenantHasQuorum(bytes32 proposalId) internal view returns (bool) {
        if (tenantQuorum == 0) return false;
        return tenantApprovalCount[proposalId] >= tenantQuorum;
    }

    /// @notice Execute a tenant proposal once quorum is reached.
    function executeTenantProposal(bytes32 proposalId) external {
        require(_tenantHasQuorum(proposalId), "Tenant quorum not reached");
        TenantProposal storage p = tenantProposals[proposalId];
        require(!p.executed, "Already executed");

        if (p.actionType == TenantActionType.SetIssuer) {
            (address issuer, bool enabled) = abi.decode(p.data, (address, bool));
            _setIssuer(issuer, enabled);
        } else if (p.actionType == TenantActionType.CreateField) {
            (bytes32 fieldId, string memory label) =
                abi.decode(p.data, (bytes32, string));
            _createField(fieldId, label);
        } else if (p.actionType == TenantActionType.RevokeField) {
            (bytes32 fieldId) = abi.decode(p.data, (bytes32));
            _revokeField(fieldId);
        } else if (p.actionType == TenantActionType.CreateSchema) {
            (bytes32 schemaId, string memory name, bytes32[] memory fieldIds) =
                abi.decode(p.data, (bytes32, string, bytes32[]));
            _createSchema(schemaId, name, fieldIds);
        } else if (p.actionType == TenantActionType.RevokeSchema) {
            (bytes32 schemaId) = abi.decode(p.data, (bytes32));
            _revokeSchema(schemaId);
        }

        p.executed = true;
    }

    // ----------------- internal structural ops -----------------

    function _setIssuer(address issuer, bool enabled) internal {
        isIssuer[issuer] = enabled;
        emit IssuerSet(issuer, enabled);
    }

    function _createField(bytes32 fieldId, string memory label) internal {
        Field storage f = fields[fieldId];
        require(!f.active, "Field exists");
        f.id = fieldId;
        f.label = label;
        f.active = true;
        emit FieldCreated(fieldId, label);
    }

    function _revokeField(bytes32 fieldId) internal {
        Field storage f = fields[fieldId];
        require(f.active, "Field not active");
        f.active = false;
        emit FieldRevoked(fieldId);
    }

    function _createSchema(
        bytes32 schemaId,
        string memory name,
        bytes32[] memory fieldIds
    ) internal {
        Schema storage s = schemas[schemaId];
        require(!s.active, "Schema exists");
        s.id = schemaId;
        s.name = name;
        s.active = true;

        for (uint256 i = 0; i < fieldIds.length; i++) {
            require(fields[fieldIds[i]].active, "Field not active");
            s.fieldIds.push(fieldIds[i]);
        }

        emit SchemaCreated(schemaId, name);
    }

    function _revokeSchema(bytes32 schemaId) internal {
        Schema storage s = schemas[schemaId];
        require(s.active, "Schema not active");
        s.active = false;
        emit SchemaRevoked(schemaId);
    }
