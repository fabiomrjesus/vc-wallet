using Microsoft.AspNetCore.Mvc;
using VcWallet.Api.Requests;
using VcWallet.Business.Commands;
using VcWallet.Business.Queries;

namespace VcWallet.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HubController(
    SignOffChainProposalCommandHandler signProposal,
    GetOffChainProposalSignaturesQueryHandler getSignatures) : ControllerBase
{
    [HttpPost("offchain/proposals/{id}/sign")]
    public async Task<IActionResult> SignProposalAsync(string id, [FromBody] SignOffChainProposalRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(id) || !IsValidKeccak256Hex(id)) return BadRequest("Invalid proposal id");

        try
        {
            var command = new SignOffChainProposalCommand(id, request.SignerAddress, request.Signature);
            var result = await signProposal.Handle(command, ct);

            return Ok(new { result.Id, result.SignerAddress, result.Signature, result.CreatedAt });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpGet("offchain/proposals/{id}/signatures")]
    public async Task<IActionResult> GetSignaturesAsync(string id, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(id) || !IsValidKeccak256Hex(id)) return BadRequest("Invalid proposal id");

        var query = new GetOffChainProposalSignaturesQuery(id);
        var items = await getSignatures.Handle(query, ct);

        return Ok(items.Select(s => new { s.Id, s.SignerAddress, s.Signature, s.CreatedAt }));
    }

    private static bool IsValidKeccak256Hex(string value)
    {
        if (value.Length != 66) return false; // 0x + 64 hex characters
        if (!value.StartsWith("0x", StringComparison.OrdinalIgnoreCase)) return false;
        for (var i = 2; i < value.Length; i++)
        {
            var c = value[i];
            var isHex = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
            if (!isHex) return false;
        }
        return true;
    }
}
