using System.Collections.Generic;
using System.Threading.Tasks;
using Verifier.Business.Models;
using Verifier.Business.Models.Dtos;

namespace Verifier.Business.Interfaces;

public interface ITemplateBusinessObject
{
    Task<OperationResult<IEnumerable<TemplateSummaryDto>>> ListAsync();

    Task<OperationResult<ProofTemplateDto>> GetAsync(string templateId);

    Task<OperationResult<TemplateValidationResult>> ValidateAsync(ProofTemplateDto template);
}
