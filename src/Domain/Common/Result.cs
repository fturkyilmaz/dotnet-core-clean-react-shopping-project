namespace ShoppingProject.Domain.Common;

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Error { get; }
    public ErrorType ErrorType { get; }

    protected Result(bool isSuccess, string error, ErrorType errorType)
    {
        IsSuccess = isSuccess;
        Error = error;
        ErrorType = errorType;
    }

    public static Result Success() => new(true, string.Empty, ErrorType.None);

    public static Result Failure(string error, ErrorType errorType = ErrorType.Validation) =>
        new(false, error, errorType);

    public static Result<T> Success<T>(T value) => Result<T>.Success(value);

    public static Result<T> Failure<T>(string error, ErrorType errorType = ErrorType.Validation) =>
        Result<T>.Failure(error, errorType);

    public static implicit operator bool(Result result) => result.IsSuccess;
}

public class Result<T> : Result
{
    public T Value { get; }

    protected Result(T value, bool isSuccess, string error, ErrorType errorType)
        : base(isSuccess, error, errorType)
    {
        Value = value;
    }

    public static Result<T> Success(T value) => new(value, true, string.Empty, ErrorType.None);

    public static new Result<T> Failure(string error, ErrorType errorType = ErrorType.Validation) =>
        new(default!, false, error, errorType);

    public static implicit operator Result<T>(T value) => Success(value);
}
