using Nethereum.Util;
using VcWallet.Business.Contracts;
using VcWallet.DataAccess.Repositories;
using VcWallet.Domain.Entities.OffChain;
using VcWallet.Eth.Contracts.Interfaces;

namespace VcWallet.Business.Commands;

public record SignOffChainProposalCommand(string ProposalId, string SignerAddress, string Signature);

public class SignOffChainProposalCommandHandler(
    OffChainProposalSignatureRepository repository,
    IOffChainGovernanceReader governanceReader,
    IOffchainSignatureHubService hubService)
{
    private readonly OffChainProposalSignatureRepository _repository = repository;
    private readonly IOffChainGovernanceReader _governanceReader = governanceReader;
    private readonly IOffchainSignatureHubService _hubService = hubService;
    private static readonly AddressUtil AddressUtil = new();

    public async Task<OffChainHubProposalSignature> Handle(SignOffChainProposalCommand command, CancellationToken ct = default)
    {
        var normalizedAddress = NormalizeAddress(command.SignerAddress);
        ValidateSignatureHex(command.Signature);

        var isSigner = await _hubService.IsSignerAsync(normalizedAddress, ct);
        if (!isSigner)
        {
            // fallback to governance reader if desired; primary check is on-chain
            isSigner = await _governanceReader.IsSignerAsync(normalizedAddress, ct);
        }
        if (!isSigner)
        {
            throw new InvalidOperationException("Signer is not authorized for this governance contract.");
        }

        var alreadySigned = await _repository.HasSignatureAsync(command.ProposalId, normalizedAddress, ct);
        if (alreadySigned)
        {
            throw new InvalidOperationException("Signer has already signed this proposal.");
        }

        var entity = new OffChainHubProposalSignature
        {
            Id = Guid.NewGuid(),
            ProposalId = command.ProposalId,
            SignerUserId = Guid.Empty,
            Signature = command.Signature,
            SignerAddress = normalizedAddress,
            CreatedAt = DateTimeOffset.UtcNow
        };

        await _repository.AddAsync(entity, ct);
        return entity;
    }

    private static string NormalizeAddress(string address)
    {
        if (string.IsNullOrWhiteSpace(address) || !AddressUtil.IsValidEthereumAddressHexFormat(address))
            throw new ArgumentException("Invalid signer address format.", nameof(address));
        return AddressUtil.ConvertToChecksumAddress(address);
    }

    private static void ValidateSignatureHex(string signature)
    {
        if (string.IsNullOrWhiteSpace(signature)) throw new ArgumentException("Signature is required.", nameof(signature));
        if (!signature.StartsWith("0x", StringComparison.OrdinalIgnoreCase)) throw new ArgumentException("Signature must be hex prefixed with 0x.", nameof(signature));
        if (signature.Length != 132) throw new ArgumentException("Signature must be 65 bytes (132 hex chars including 0x).", nameof(signature));
        for (var i = 2; i < signature.Length; i++)
        {
            var c = signature[i];
            var isHex = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
            if (!isHex) throw new ArgumentException("Signature must be valid hex.", nameof(signature));
        }
    }
}
