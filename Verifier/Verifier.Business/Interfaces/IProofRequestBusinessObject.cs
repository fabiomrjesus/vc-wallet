using System;
using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface IProofRequestBusinessObject
{
    Task<OperationResult<ProofRequestDto>> CreateAsync(string templateId, string? aud, Uri? callback);

    Task<OperationResult<bool>> CancelAsync(string nonce);

    Task<OperationResult<ProofRequestStatusDto>> GetStatusAsync(string nonce);
}
