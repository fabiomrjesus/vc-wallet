using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Domain;

namespace Verifier.Business.BusinessObjects;

public class AuditBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), IAuditBusinessObject
{
    public async Task<OperationResult> RecordAsync(VerificationRecord record)
    {
        return await ExecuteOperation(async () =>
        {

        });
    }

    public Task<OperationResult<VerificationRecord?>> GetAsync(Guid decisionId)
    {
        return await ExecuteOperation(async () =>
        {

        });
    }

    public Task<OperationResult<IEnumerable<VerificationRecord>>> QueryAsync(AuditQuery query)
    {
        return await ExecuteOperation(async () =>
        {

        });
    }
}
