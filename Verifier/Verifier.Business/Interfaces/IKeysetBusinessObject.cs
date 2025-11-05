using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface IKeysetBusinessObject
{
    Task<OperationResult<JwksDto>> GetJwks();

    Task<OperationResult<string>> GetActiveKeyId();

    Task<OperationResult<bool>> IsAlgAllowed(string algorithm);
}
