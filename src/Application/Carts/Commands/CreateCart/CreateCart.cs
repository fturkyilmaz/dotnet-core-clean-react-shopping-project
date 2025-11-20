using ShoppingProject.Application.Common.Interfaces;
using FluentValidation;
using MediatR;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

[Authorize]
public record CreateCartCommand : IRequest<int>
{
    public string Title { get; init; } = "";
    public decimal Price { get; init; }
    public string Image { get; init; } = "";
    public int Quantity { get; init; }
}

public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        var entity = new Cart
        {
            Title = request.Title,
            Price = request.Price,
            Image = request.Image,
            Quantity = request.Quantity
        };

        entity.AddDomainEvent(new CartCreatedEvent(entity)); // Event to be created later

        _context.Carts.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}

public class CreateCartCommandValidator : AbstractValidator<CreateCartCommand>
{
    public CreateCartCommandValidator()
    {
        RuleFor(v => v.Title)
            .MaximumLength(200)
            .NotEmpty();

        RuleFor(v => v.Price)
            .GreaterThan(0);

        RuleFor(v => v.Quantity)
            .GreaterThan(0);
    }
}
