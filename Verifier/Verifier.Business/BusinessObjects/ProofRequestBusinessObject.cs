using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class ProofRequestBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), IProofRequestBusinessObject
{
    public Task<OperationResult<ProofRequestDto>> CreateAsync(string templateId, string? aud, Uri? callback) =>
        ExecuteOperation<ProofRequestDto>(() => Task.FromException<ProofRequestDto>(new NotImplementedException()));

    public Task<OperationResult<bool>> CancelAsync(string nonce) =>
        ExecuteOperation<bool>(() => Task.FromException<bool>(new NotImplementedException()));

    public Task<OperationResult<ProofRequestStatusDto>> GetStatusAsync(string nonce) =>
        ExecuteOperation<ProofRequestStatusDto>(() => Task.FromException<ProofRequestStatusDto>(new NotImplementedException()));
}
