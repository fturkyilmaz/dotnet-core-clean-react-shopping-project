using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.DeleteProduct;

[Authorize(Policy = Policies.CanManageProducts)]
public record DeleteProductCommand(int Id) : IRequest;
