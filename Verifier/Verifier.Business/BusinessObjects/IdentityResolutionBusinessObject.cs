using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class IdentityResolutionBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), IIdentityResolutionBusinessObject
{
    public Task<OperationResult<JwksDto>> ResolveJwksAsync(string didOrIssuer) =>
        ExecuteOperation<JwksDto>(() => Task.FromException<JwksDto>(new NotImplementedException()));

    public Task<OperationResult<IssuerPolicyDto>> GetIssuerPolicyAsync(string didOrIssuer) =>
        ExecuteOperation<IssuerPolicyDto>(() => Task.FromException<IssuerPolicyDto>(new NotImplementedException()));
}
