using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class CredentialStatusBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), ICredentialStatusBusinessObject
{
    public Task<OperationResult<StatusCheckResult>> CheckAsync(CredentialDescriptor descriptor) =>
        ExecuteOperation<StatusCheckResult>(() => Task.FromException<StatusCheckResult>(new NotImplementedException()));

    public Task<OperationResult<bool>> RegisterRevocationAsync(CredentialRevocationDto revocation) =>
        ExecuteOperation<bool>(() => Task.FromException<bool>(new NotImplementedException()));
}
