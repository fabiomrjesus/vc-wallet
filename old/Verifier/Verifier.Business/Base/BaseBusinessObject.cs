using Microsoft.Extensions.Logging;
using System.Transactions;
using Verifier.Business.Models;

namespace Verifier.Business.Base;

public class BaseBusinessObject(ILogger<BaseBusinessObject> logger)
{
    protected readonly ILogger Logger = logger;

    private readonly TransactionOptions _defaultOptions = new()
    {
        Timeout = TimeSpan.FromSeconds(60),
        IsolationLevel = IsolationLevel.ReadCommitted
    };

    internal bool TryUpdateProperty<T, TProperty>(T source, T target, Func<T, TProperty> sourceSelector, Action<T, TProperty> targetSetter, bool previousValue = false)
    {
        var sourceValue = sourceSelector(source);

        if (sourceValue != null && !sourceValue.Equals(sourceSelector(target)))
        {
            targetSetter(target, sourceValue);
            return true;
        }

        return previousValue;
    }

    protected async Task<OperationResult> ExecuteOperation(Func<Task> func, TransactionOptions? options = null)
    {
        try
        {
            using var scope = new TransactionScope(TransactionScopeOption.Required, options ?? _defaultOptions, TransactionScopeAsyncFlowOption.Enabled);
            await func();
            scope.Complete();
            return OperationResult.Ok();
        }
        catch (Exception ex)
        {
            return OperationResult.Fail(ex);
        }
    }

    protected async Task<OperationResult<T>> ExecuteOperation<T>(Func<Task<T>> func, TransactionOptions? options = null)
    {
        try
        {
            using var scope = new TransactionScope(TransactionScopeOption.Required, options ?? _defaultOptions, TransactionScopeAsyncFlowOption.Enabled);
            var result = await func();
            scope.Complete();
            return OperationResult<T>.Ok(result);
        }
        catch (Exception ex)
        {
            return OperationResult<T>.Fail(ex);
        }
    }
}