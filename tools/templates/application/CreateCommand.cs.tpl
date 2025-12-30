using MediatR;

namespace Catalog.Application.${NAME}s.Commands.Create${NAME};

public record Create${NAME}Command(string Name) : IRequest<Guid>;
