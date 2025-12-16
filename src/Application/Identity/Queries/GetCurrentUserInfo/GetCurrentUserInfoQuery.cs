using MediatR;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;

/// <summary>
/// Query to fetch detailed information for a specific user ID.
/// </summary>
public record GetCurrentUserInfoQuery(string UserId) : IRequest<ServiceResult<UserInfoResponse>>;
