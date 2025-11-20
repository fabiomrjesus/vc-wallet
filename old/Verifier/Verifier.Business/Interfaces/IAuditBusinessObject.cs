using Verifier.Business.Models;
using Verifier.Domain;
namespace Verifier.Business.Interfaces;

public interface IAuditBusinessObject
{
    Task<OperationResult> RecordAsync(VerificationRecord record);

    Task<OperationResult<VerificationRecord?>> GetAsync(Guid decisionId);

    Task<OperationResult<IEnumerable<VerificationRecord>>> QueryAsync(AuditQuery query);
}
