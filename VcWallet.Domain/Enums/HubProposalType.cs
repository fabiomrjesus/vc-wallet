namespace VcWallet.Domain.Enums;

public enum HubProposalType : byte
{
    AssignSigner = 0,
    RevokeSigner = 1,
    TransferOwnership = 2,
    SetContractRole = 3
}
