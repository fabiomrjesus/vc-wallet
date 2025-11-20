using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Verifier.Api.Models.Requests;
using Verifier.Api.Models.Responses;

namespace Verifier.Api.Controllers;

[ApiController]
[Route("proof-requests")]
public class ProofRequestsController : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CreateProofRequestResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public ActionResult<CreateProofRequestResponse> CreateProofRequest([FromBody] CreateProofRequestRequest request)
    {
        throw new NotImplementedException();
    }
}
