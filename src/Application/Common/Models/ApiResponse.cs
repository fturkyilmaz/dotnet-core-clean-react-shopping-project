using System.Net;
using System.Text.Json.Serialization;

namespace ShoppingProject.Application.Common.Models;

/// <summary>
/// Standardized API response wrapper for consistent response format across all endpoints.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<ApiError>? Errors { get; set; }
    public int StatusCode { get; set; }
    public string? TraceId { get; set; }
    public DateTime Timestamp { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PaginationInfo? Pagination { get; set; }

    public ApiResponse()
    {
        Timestamp = DateTime.UtcNow;
    }

    public static ApiResponse<T> SuccessResponse(T data, string? message = null, int statusCode = (int)HttpStatusCode.OK)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message,
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponse<T> CreatedResponse(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message,
            StatusCode = (int)HttpStatusCode.Created,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, List<ApiError>? errors = null, int statusCode = (int)HttpStatusCode.BadRequest)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors,
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponse<T> NotFoundResponse(string message = "Resource not found")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            StatusCode = (int)HttpStatusCode.NotFound,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponse<T> ValidationErrorResponse(List<ApiError> errors, string message = "Validation failed")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors,
            StatusCode = (int)HttpStatusCode.UnprocessableEntity,
            Timestamp = DateTime.UtcNow
        };
    }

    public ApiResponse<T> WithPagination(int pageNumber, int pageSize, int totalCount, int totalPages)
    {
        Pagination = new PaginationInfo
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = pageNumber > 1,
            HasNextPage = pageNumber < totalPages
        };
        return this;
    }

    public ApiResponse<T> WithTraceId(string traceId)
    {
        TraceId = traceId;
        return this;
    }
}

public class ApiError
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Field { get; set; }

    public ApiError()
    {
    }

    public ApiError(string code, string message, string? field = null)
    {
        Code = code;
        Message = message;
        Field = field;
    }
}

public class PaginationInfo
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
}
