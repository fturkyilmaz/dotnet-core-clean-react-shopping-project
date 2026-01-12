using MediatR;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetAllUsers;

public record GetAllUsersQuery(int PageNumber = 1, int PageSize = 10) : IRequest<ServiceResult<PaginatedList<UserInfoResponse>>>;
