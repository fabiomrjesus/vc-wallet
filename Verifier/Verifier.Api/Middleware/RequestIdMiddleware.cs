using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Verifier.Api.Middleware;

public class RequestIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _headerName;

    public RequestIdMiddleware(RequestDelegate next, string headerName)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _headerName = string.IsNullOrWhiteSpace(headerName) ? "X-Request-Id" : headerName;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        var requestId = GetOrGenerateRequestId(context);

        context.Response.OnStarting(() =>
        {
            context.Response.Headers[_headerName] = requestId;
            return Task.CompletedTask;
        });

        await _next(context);
    }

    private string GetOrGenerateRequestId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(_headerName, out var values))
        {
            var firstValue = values.ToString();
            if (!string.IsNullOrWhiteSpace(firstValue))
            {
                return firstValue;
            }
        }

        var newId = Guid.NewGuid().ToString();
        context.Request.Headers[_headerName] = newId;
        return newId;
    }
}
