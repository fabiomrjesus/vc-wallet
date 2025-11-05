using System.Threading;
using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface IVerificationBusinessObject
{
    Task<OperationResult<VerifyDecisionDto>> VerifyAsync(VerifyRequestDto request, CancellationToken cancellationToken);

    Task<OperationResult<PredicateCheckResult>> DryRunAsync(string templateId, ClaimSet claims);
}
