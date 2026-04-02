using Microsoft.AspNetCore.Http;

namespace ShoppingProject.WebApi.Extensions
{
    /// <summary>
    /// Extension methods for HTTP response cookie operations.
    /// Provides secure cookie handling for authentication tokens.
    /// </summary>
    public static class CookieExtensions
    {
        /// <summary>
        /// Sets an authentication token as an HttpOnly, Secure cookie.
        /// </summary>
        /// <param name="response">The HTTP response</param>
        /// <param name="tokenName">The name of the cookie</param>
        /// <param name="tokenValue">The token value</param>
        /// <param name="expirationMinutes">Cookie expiration in minutes</param>
        public static void SetAuthCookie(
            this HttpResponse response,
            string tokenName,
            string tokenValue,
            int expirationMinutes)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Path = "/"
            };

            response.Cookies.Append(tokenName, tokenValue, cookieOptions);
        }

        /// <summary>
        /// Sets the access token cookie.
        /// </summary>
        public static void SetAccessTokenCookie(this HttpResponse response, string token, int expiryMinutes = 60)
        {
            response.SetAuthCookie("access_token", token, expiryMinutes);
        }

        /// <summary>
        /// Sets the refresh token cookie with longer expiration.
        /// </summary>
        public static void SetRefreshTokenCookie(this HttpResponse response, string token, int expiryDays = 7)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(expiryDays),
                Path = "/"
            };

            response.Cookies.Append("refresh_token", token, cookieOptions);
        }

        /// <summary>
        /// Deletes authentication cookies.
        /// </summary>
        public static void DeleteAuthCookies(this HttpResponse response)
        {
            var deleteOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(-1),
                Path = "/"
            };

            response.Cookies.Delete("access_token", deleteOptions);
            response.Cookies.Delete("refresh_token", deleteOptions);
            response.Cookies.Delete("XSRF-TOKEN", deleteOptions);
        }
    }
}
