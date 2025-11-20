using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface IIdentityResolutionBusinessObject
{
    Task<OperationResult<JwksDto>> ResolveJwksAsync(string didOrIssuer);

    Task<OperationResult<IssuerPolicyDto>> GetIssuerPolicyAsync(string didOrIssuer);
}
