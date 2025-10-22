using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Moongy.Labs.VcWallet.Gateway.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = Policies.Holder)]
public class HolderController : ControllerBase
{
    [HttpGet("registry/snapshot")]
    public async Task<ActionResult<Snapshot>> GetSnapshot()
    {

    }

    [HttpPost("proofs/prepare")]
    public async Task<ActionResult<Decision>> Prepare([FromBody] PrepareProofRequest req)
    {

    }

    [HttpPost("proofs/generate")]
    public async Task<ActionResult<GenerateProofResponse>> Generate([FromBody] GenerateProofRequest req)
    {

    }

    [HttpPost("proofs/submit-onchain")]
    public async Task<ActionResult<UnsignedTransaction>> SubmitOnChain([FromBody] SubmitOnChainRequest req)
    {

    }



}
