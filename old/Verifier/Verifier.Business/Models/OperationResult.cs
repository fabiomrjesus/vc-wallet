namespace Verifier.Business.Models;

public class OperationResult
{
    public bool Success { get; init; }
    public Exception? Exception { get; init; }

    public static OperationResult Ok() =>
        new() { Success = true};

    public static OperationResult Fail(Exception exception) =>
        new()
        {
            Success = false,
            Exception = exception
        };
}

public class OperationResult<T> : OperationResult
{
    public T? Result { get; init; }

    public static OperationResult<T> Ok(T result) =>
        new()
        {
            Success = true,
            Result = result,
        };

    public static new OperationResult<T> Fail(Exception exception) => new()
    {
        Success = false,
        Exception = exception
    };
}