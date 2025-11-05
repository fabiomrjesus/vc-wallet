using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Verifier.Api.Models.Responses;

namespace Verifier.Api.Controllers;

[ApiController]
[Route(".well-known")]
public class WellKnownController : ControllerBase
{
    [HttpGet("jwks.json")]
    [ProducesResponseType(typeof(JsonWebKeySetResponse), StatusCodes.Status200OK)]
    public ActionResult<JsonWebKeySetResponse> GetJwks()
    {
        throw new NotImplementedException();
    }
}
