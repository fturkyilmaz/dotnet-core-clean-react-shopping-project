using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ShoppingProject.WebApi.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ApiKeyAttribute : ActionFilterAttribute
{
    private const string ApiKeyHeaderName = "X-Api-Key";
    private const string ApiKeySectionName = "Authentication:ApiKey";

    public override async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next
    )
    {
        if (
            !context.HttpContext.Request.Headers.TryGetValue(
                ApiKeyHeaderName,
                out var extractedApiKey
            )
        )
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Api Key was not provided",
            };
            return;
        }

        var appSettings = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var apiKey = appSettings.GetValue<string>(ApiKeySectionName);

        if (string.IsNullOrEmpty(apiKey) || !apiKey.Equals(extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Unauthorized client",
            };
            return;
        }

        await next();
    }
}
