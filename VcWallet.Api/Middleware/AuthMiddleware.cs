using Microsoft.AspNetCore.Identity;
using VcWallet.Api.Requests;

namespace VcWallet.Api.Middleware;

/// <summary>
/// Encapsulates auth workflows using ASP.NET Identity (EF-backed).
/// </summary>
public class AuthMiddleware
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthMiddleware(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<IdentityResult> RegisterAsync(RegisterRequest request)
    {
        var user = new IdentityUser { UserName = request.UserName, Email = request.Email };
        return await _userManager.CreateAsync(user, request.Password);
    }

    public async Task<SignInResult> LoginAsync(LoginRequest request)
    {
        return await _signInManager.PasswordSignInAsync(request.UserName, request.Password, isPersistent: true, lockoutOnFailure: false);
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }

    public async Task<string?> GeneratePasswordResetTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;
        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<IdentityResult> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return IdentityResult.Failed(new IdentityError { Description = "User not found." });
        return await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
    }
}
