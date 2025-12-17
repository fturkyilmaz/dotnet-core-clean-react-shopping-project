using System.Net;
using System.Text.Json.Serialization;

namespace ShoppingProject.Application.Common.Models
{
    public class ServiceResult<T>
    {
        public bool IsSuccess { get; }
        public T? Data { get; }
        public string Message { get; } = string.Empty;
        public HttpStatusCode StatusCode { get; }
        public string Location { get; } = string.Empty;

        public ServiceResult() {}

        [JsonConstructor]
        public ServiceResult(bool isSuccess, T? data, string message, HttpStatusCode statusCode, string location = "")
        {
            IsSuccess = isSuccess;
            Data = data;
            Message = message;
            StatusCode = statusCode;
            Location = location;
        }

        public static ServiceResult<T> Success(T data, HttpStatusCode statusCode = HttpStatusCode.OK)
            => new(true, data, "Operation successful", statusCode);

        public static ServiceResult<T> SuccessAsCreated(T data, string location)
            => new(true, data, "Operation successful", HttpStatusCode.Created, location);

        public static ServiceResult<T> Fail(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
            => new(false, default, message, statusCode);

        public static ServiceResult<T> Fail(IEnumerable<string> errors)
            => new(false, default, string.Join(", ", errors ?? Enumerable.Empty<string>()), HttpStatusCode.BadRequest);
    }
}
