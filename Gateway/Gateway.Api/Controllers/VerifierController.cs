using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Moongy.Labs.VcWallet.Gateway.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = Policies.Verifier)]
    public class VerifierController : ControllerBase
    {


    }
}
