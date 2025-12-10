using Microsoft.AspNetCore.Mvc;
using VcWallet.Api.Requests;
using VcWallet.Business.Services;

namespace VcWallet.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HubController(ProposalSignatureService proposalSignatures) : ControllerBase
{
    [HttpPost("proposals/{id}/sign")]
    public async Task<IActionResult> SignProposalAsync(string id, [FromBody] SignProposalRequest request, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var proposalId)) return BadRequest("Invalid proposal id");
        var result = await proposalSignatures.AddSignatureAsync(proposalId, request.SignerAddress, request.Signature, ct);
        return CreatedAtAction(nameof(GetSignaturesAsync), new { id }, new { result.Id, result.SignerAddress, result.Signature, result.CreatedAt });
    }

    [HttpGet("proposals/{id}/signatures")]
    public async Task<IActionResult> GetSignaturesAsync(string id, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var proposalId)) return BadRequest("Invalid proposal id");
        var items = await proposalSignatures.GetSignaturesAsync(proposalId, ct);
        return Ok(items.Select(s => new { s.Id, s.SignerAddress, s.Signature, s.CreatedAt }));
    }
}
