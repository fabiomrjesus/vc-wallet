using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class KeysetBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), IKeysetBusinessObject
{
    public Task<OperationResult<JwksDto>> GetJwks() =>
        ExecuteOperation<JwksDto>(() => Task.FromException<JwksDto>(new NotImplementedException()));

    public Task<OperationResult<string>> GetActiveKeyId() =>
        ExecuteOperation<string>(() => Task.FromException<string>(new NotImplementedException()));

    public Task<OperationResult<bool>> IsAlgAllowed(string algorithm) =>
        ExecuteOperation<bool>(() => Task.FromException<bool>(new NotImplementedException()));
}
