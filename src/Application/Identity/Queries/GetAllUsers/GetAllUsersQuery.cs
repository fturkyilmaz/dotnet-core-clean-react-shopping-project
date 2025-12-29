using MediatR;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetAllUsers;

public record GetAllUsersQuery() : IRequest<ServiceResult<List<UserInfoResponse>>>;
