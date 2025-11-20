using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Verifier.Api.Models.Responses;

namespace Verifier.Api.Controllers;

[ApiController]
[Route("templates")]
public class TemplatesController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TemplateDescriptorResponse>), StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<TemplateDescriptorResponse>> GetTemplates()
    {
        throw new NotImplementedException();
    }
}
