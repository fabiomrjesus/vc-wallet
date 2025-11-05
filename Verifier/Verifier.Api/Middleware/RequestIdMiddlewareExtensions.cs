using Microsoft.AspNetCore.Builder;

namespace Verifier.Api.Middleware;

public static class RequestIdMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestId(this IApplicationBuilder app, string headerName)
    {
        return app.UseMiddleware<RequestIdMiddleware>(headerName);
    }
}
