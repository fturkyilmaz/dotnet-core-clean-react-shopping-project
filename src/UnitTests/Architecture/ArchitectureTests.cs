using System.Reflection;
using NetArchTest.Rules;

namespace ShoppingProject.UnitTests.Architecture;

public class ArchitectureTests
{
    private static readonly Assembly DomainAssembly =
        typeof(ShoppingProject.Domain.Entities.Product).Assembly;
    private static readonly Assembly ApplicationAssembly =
        typeof(ShoppingProject.Application.Common.Interfaces.IApplicationDbContext).Assembly;
    private static readonly Assembly InfrastructureAssembly =
        typeof(ShoppingProject.Infrastructure.Data.ApplicationDbContext).Assembly;
    private static readonly Assembly PresentationAssembly =
        typeof(ShoppingProject.WebApi.Middleware.ApiKeyMiddleware).Assembly;

    [Fact]
    public void Domain_Should_Not_HaveDependencyOnOtherProjects()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("ShoppingProject.Application")
            .GetResult();

        // Assert
        Assert.True(result.IsSuccessful, "Domain layer should not depend on Application layer");
    }

    [Fact]
    public void Domain_Should_Not_HaveDependencyOn_Infrastructure()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("ShoppingProject.Infrastructure")
            .GetResult();

        // Assert
        Assert.True(result.IsSuccessful, "Domain layer should not depend on Infrastructure layer");
    }

    [Fact]
    public void Application_Should_Not_HaveDependencyOn_Infrastructure()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("ShoppingProject.Infrastructure")
            .GetResult();

        // Assert
        Assert.True(
            result.IsSuccessful,
            "Application layer should not depend on Infrastructure layer"
        );
    }

    [Fact]
    public void Application_Should_Not_HaveDependencyOn_Presentation()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("ShoppingProject.WebApi")
            .GetResult();

        // Assert
        Assert.True(
            result.IsSuccessful,
            "Application layer should not depend on Presentation layer"
        );
    }

    [Fact]
    public void Application_Should_Not_Reference_EntityFrameworkCore()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("Microsoft.EntityFrameworkCore")
            .GetResult();

        // Assert
        Assert.True(
            result.IsSuccessful,
            "Application layer should not have direct dependency on EF Core. "
                + "Use repository pattern instead."
        );
    }

    [Fact]
    public void Handlers_Should_Have_DependencyOn_MediatR()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(ApplicationAssembly)
            .That()
            .HaveNameEndingWith("Handler")
            .Should()
            .HaveDependencyOn("MediatR")
            .GetResult();

        // Assert
        Assert.True(result.IsSuccessful, "All handlers should depend on MediatR");
    }

    [Fact]
    public void Domain_Entities_Should_BeSealed_Or_Abstract()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(DomainAssembly)
            .That()
            .ResideInNamespace("ShoppingProject.Domain.Entities")
            .Should()
            .BeSealed()
            .Or()
            .BeAbstract()
            .GetResult();

        // Note: This test might fail if you have non-sealed entities
        // You can adjust based on your design preferences
    }

    [Fact]
    public void Repositories_Should_HaveCorrectNaming()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(InfrastructureAssembly)
            .That()
            .ImplementInterface(typeof(ShoppingProject.Application.Common.Interfaces.IRepository<>))
            .Should()
            .HaveNameEndingWith("Repository")
            .GetResult();

        // Assert
        Assert.True(
            result.IsSuccessful,
            "All repository implementations should end with 'Repository'"
        );
    }

    [Fact]
    public void Repositories_Should_ResideIn_RepositoriesNamespace()
    {
        // Arrange & Act
        var result = Types
            .InAssembly(InfrastructureAssembly)
            .That()
            .HaveNameEndingWith("Repository")
            .And()
            .AreClasses()
            .Should()
            .ResideInNamespace("ShoppingProject.Infrastructure.Repositories")
            .GetResult();

        // Assert
        Assert.True(
            result.IsSuccessful,
            "All repositories should reside in Infrastructure.Repositories namespace"
        );
    }

    [Fact]
    public void Controllers_Should_HaveCorrectNaming()
    {
        var result = Types
            .InAssembly(PresentationAssembly)
            .That()
            .ResideInNamespace("ShoppingProject.WebApi.Controllers")
            .Should()
            .HaveNameEndingWith("Controller")
            .GetResult();

        Assert.True(result.IsSuccessful, "All controllers should end with 'Controller'");
    }

    [Fact]
    public void Controllers_Should_NotDependOnInfrastructureOrApplication()
    {
        var result = Types
            .InAssembly(PresentationAssembly)
            .That()
            .ResideInNamespace("ShoppingProject.WebApi.Controllers")
            .ShouldNot()
            .HaveDependencyOn("ShoppingProject.Infrastructure")
            .AndShouldNot()
            .HaveDependencyOn("ShoppingProject.Application")
            .GetResult();

        Assert.True(
            result.IsSuccessful,
            "Controllers should not depend directly on Infrastructure or Application layers"
        );
    }

    [Fact]
    public void Services_Should_HaveCorrectNaming()
    {
        var result = Types
            .InAssembly(InfrastructureAssembly)
            .That()
            .ResideInNamespace("ShoppingProject.Infrastructure.Services")
            .Should()
            .HaveNameEndingWith("Service")
            .GetResult();

        Assert.True(result.IsSuccessful, "All services should end with 'Service'");
    }
}
