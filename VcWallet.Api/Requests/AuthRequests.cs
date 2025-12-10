namespace VcWallet.Api.Requests;

public record RegisterRequest(string UserName, string Email, string Password);
public record LoginRequest(string UserName, string Password);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
public record SignProposalRequest(string SignerAddress, string Signature);
