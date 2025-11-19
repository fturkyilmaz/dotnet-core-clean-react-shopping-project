using System.Net;

namespace ShoppingProject.Application.Common.Models
{
    public class ServiceResult<T>
    {
        public bool IsSuccess { get; }
        public T? Data { get; }
        public string Message { get; }
        public HttpStatusCode StatusCode { get; }
        public string Location { get; }

        private ServiceResult(bool isSuccess, T? data, string message, HttpStatusCode statusCode, string location = "")
        {
            IsSuccess = isSuccess;
            Data = data;
            Message = message;
            StatusCode = statusCode;
            Location = location;
        }

        public static ServiceResult<T> SuccessAsCreated(T data, string location)
            => new(true, data, "Operation successful", HttpStatusCode.Created, location);

        public static ServiceResult<T> Fail(string message, HttpStatusCode statusCode)
            => new(false, default, message, statusCode);
    }
}
