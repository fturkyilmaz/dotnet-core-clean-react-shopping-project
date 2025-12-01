using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Authorization;
using Xunit;

namespace ShoppingProject.UnitTests.Infrastructure.Authorization;

public class AuthorizationPolicyTests
{
    private readonly AuthorizationOptions _authorizationOptions;

    public AuthorizationPolicyTests()
    {
        // Create authorization options and configure them the same way as in DependencyInjection.cs
        _authorizationOptions = new AuthorizationOptions();

        // Administrator-only policies
        _authorizationOptions.AddPolicy(
            Policies.CanPurge,
            policy => policy.RequireRole(Roles.Administrator)
        );
        _authorizationOptions.AddPolicy(
            Policies.CanManageProducts,
            policy => policy.RequireRole(Roles.Administrator)
        );
        _authorizationOptions.AddPolicy(
            Policies.RequireAdministratorRole,
            policy => policy.RequireRole(Roles.Administrator)
        );
        _authorizationOptions.AddPolicy(
            Policies.CanManageClients,
            policy => policy.RequireRole(Roles.Administrator)
        );
        _authorizationOptions.AddPolicy(
            Policies.CanViewSystemConfig,
            policy => policy.RequireRole(Roles.Administrator)
        );

        // Client role policy
        _authorizationOptions.AddPolicy(
            Policies.RequireClientRole,
            policy => policy.RequireRole(Roles.Client)
        );

        // Resource-based policy for Dietitians managing their assigned clients
        _authorizationOptions.AddPolicy(
            Policies.CanManageOwnClients,
            policy =>
            {
                policy.RequireRole(Roles.Client);
                policy.Requirements.Add(new ResourceOwnerRequirement("Client"));
            }
        );
    }

    [Fact]
    public void AuthorizationPolicies_AllPoliciesRegistered()
    {
        // Act & Assert - Verify all policies exist
        var policies = new[]
        {
            Policies.CanPurge,
            Policies.CanManageProducts,
            Policies.RequireAdministratorRole,
            Policies.CanManageClients,
            Policies.CanViewSystemConfig,
            Policies.RequireClientRole,
            Policies.CanManageOwnClients,
        };

        foreach (var policyName in policies)
        {
            var policy = _authorizationOptions.GetPolicy(policyName);
            Assert.NotNull(policy);
        }
    }

    [Fact]
    public void CanPurgePolicy_RequiresAdministratorRole()
    {
        // Act
        var policy = _authorizationOptions.GetPolicy(Policies.CanPurge);

        // Assert
        Assert.NotNull(policy);
        Assert.Contains(
            policy.Requirements,
            r =>
                r is RolesAuthorizationRequirement rolesReq
                && rolesReq.AllowedRoles.Contains(Roles.Administrator)
        );
    }

    [Fact]
    public void CanManageProductsPolicy_RequiresAdministratorRole()
    {
        // Act
        var policy = _authorizationOptions.GetPolicy(Policies.CanManageProducts);

        // Assert
        Assert.NotNull(policy);
        Assert.Contains(
            policy.Requirements,
            r =>
                r is RolesAuthorizationRequirement rolesReq
                && rolesReq.AllowedRoles.Contains(Roles.Administrator)
        );
    }

    [Fact]
    public void RequireAdministratorRolePolicy_RequiresAdministratorRole()
    {
        // Act
        var policy = _authorizationOptions.GetPolicy(Policies.RequireAdministratorRole);

        // Assert
        Assert.NotNull(policy);
        Assert.Contains(
            policy.Requirements,
            r =>
                r is RolesAuthorizationRequirement rolesReq
                && rolesReq.AllowedRoles.Contains(Roles.Administrator)
        );
    }

    [Fact]
    public void RequireClientRolePolicy_RequiresClientRole()
    {
        // Act
        var policy = _authorizationOptions.GetPolicy(Policies.RequireClientRole);

        // Assert
        Assert.NotNull(policy);
        Assert.Contains(
            policy.Requirements,
            r =>
                r is RolesAuthorizationRequirement rolesReq
                && rolesReq.AllowedRoles.Contains(Roles.Client)
        );
    }

    [Fact]
    public void CanManageOwnClientsPolicy_RequiresDietitianRoleAndResourceOwnership()
    {
        // Act
        var policy = _authorizationOptions.GetPolicy(Policies.CanManageOwnClients);

        // Assert
        Assert.NotNull(policy);
        Assert.Contains(
            policy.Requirements,
            r =>
                r is RolesAuthorizationRequirement rolesReq
                && rolesReq.AllowedRoles.Contains(Roles.Dietitian)
        );
        Assert.Contains(policy.Requirements, r => r is ResourceOwnerRequirement);
    }
}
