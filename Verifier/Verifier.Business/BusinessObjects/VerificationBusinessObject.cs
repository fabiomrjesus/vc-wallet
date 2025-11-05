using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class VerificationBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), IVerificationBusinessObject
{
    public Task<OperationResult<VerifyDecisionDto>> VerifyAsync(VerifyRequestDto request, CancellationToken cancellationToken) =>
        ExecuteOperation<VerifyDecisionDto>(() => Task.FromException<VerifyDecisionDto>(new NotImplementedException()));

    public Task<OperationResult<PredicateCheckResult>> DryRunAsync(string templateId, ClaimSet claims) =>
        ExecuteOperation<PredicateCheckResult>(() => Task.FromException<PredicateCheckResult>(new NotImplementedException()));
}
