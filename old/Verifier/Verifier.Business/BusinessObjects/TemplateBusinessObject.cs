using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Verifier.Business.Base;
using Verifier.Business.Interfaces;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.BusinessObjects;

public class TemplateBusinessObject(ILogger<BaseBusinessObject> logger)
    : BaseBusinessObject(logger), ITemplateBusinessObject
{
    public Task<OperationResult<IEnumerable<TemplateSummaryDto>>> ListAsync() =>
        ExecuteOperation<IEnumerable<TemplateSummaryDto>>(
            () => Task.FromException<IEnumerable<TemplateSummaryDto>>(new NotImplementedException()));

    public Task<OperationResult<ProofTemplateDto>> GetAsync(string templateId) =>
        ExecuteOperation<ProofTemplateDto>(() => Task.FromException<ProofTemplateDto>(new NotImplementedException()));

    public Task<OperationResult<TemplateValidationResult>> ValidateAsync(ProofTemplateDto template) =>
        ExecuteOperation<TemplateValidationResult>(() => Task.FromException<TemplateValidationResult>(new NotImplementedException()));
}
