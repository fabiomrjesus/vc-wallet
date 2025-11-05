using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Verifier.Api.Models.Requests;
using Verifier.Api.Models.Responses;

namespace Verifier.Api.Controllers;

[ApiController]
[Route("verify")]
public class VerificationController : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(SubmitPresentationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status410Gone)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<SubmitPresentationResponse> SubmitPresentation([FromBody] SubmitPresentationRequest request)
    {
        throw new NotImplementedException();
    }
}
