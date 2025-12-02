using FluentValidation;

namespace ShoppingProject.Infrastructure.Configuration.Validators
{
    public class RabbitMqOptionsValidator : AbstractValidator<RabbitMqOptions>
    {
        public RabbitMqOptionsValidator()
        {
            RuleFor(x => x.Url)
                .NotEmpty()
                .WithMessage("RabbitMQ Url is required")
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
                .WithMessage("RabbitMQ Url must be a valid URI");

            RuleFor(x => x.Username).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    public class RedisOptionsValidator : AbstractValidator<RedisOptions>
    {
        public RedisOptionsValidator()
        {
            RuleFor(x => x.ConnectionString)
                .NotEmpty()
                .WithMessage("Redis connection string is required");
        }
    }

    public class PostgresOptionsValidator : AbstractValidator<PostgresOptions>
    {
        public PostgresOptionsValidator()
        {
            RuleFor(x => x.ConnectionString)
                .NotEmpty()
                .WithMessage("Postgres connection string is required");
        }
    }
}
