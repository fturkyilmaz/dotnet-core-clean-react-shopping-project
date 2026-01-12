using MediatR;

namespace Catalog.Application.${NAME}s.Commands.Create${NAME};

public class Create${NAME}Handler : IRequestHandler<Create${NAME}Command, Guid>
{
    public Task<Guid> Handle(Create${NAME}Command request, CancellationToken ct)
    {
        return Task.FromResult(Guid.NewGuid());
    }
}
