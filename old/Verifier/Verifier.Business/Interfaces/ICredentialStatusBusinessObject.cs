using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface ICredentialStatusBusinessObject
{
    Task<OperationResult<StatusCheckResult>> CheckAsync(CredentialDescriptor descriptor);

    Task<OperationResult<bool>> RegisterRevocationAsync(CredentialRevocationDto revocation);
}
