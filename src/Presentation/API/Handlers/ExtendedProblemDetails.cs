using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Handlers
{
    public class ExtendedProblemDetails : ProblemDetails
    {
        public string? ErrorCode { get; set; }
    }
}
