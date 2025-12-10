using Microsoft.AspNetCore.Mvc;
using VcWallet.Api.Middleware;
using VcWallet.Api.Requests;

namespace VcWallet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthMiddleware auth) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await auth.RegisterAsync(request);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await auth.LoginAsync(request);
        if (!result.Succeeded) return Unauthorized();
        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await auth.LogoutAsync();
        return Ok();
    }

    [HttpPost("password/forgot")]
    public async Task<IActionResult> ForgotPassword([FromBody] string email)
    {
        var token = await auth.GeneratePasswordResetTokenAsync(email);
        if (token == null) return NotFound();
        // token should be emailed out-of-band in a real system
        return Ok(new { token });
    }

    [HttpPost("password/reset")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await auth.ResetPasswordAsync(request);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok();
    }
}
