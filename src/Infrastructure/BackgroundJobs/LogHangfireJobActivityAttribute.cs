using Hangfire.Common;
using Hangfire.States;
using Hangfire.Storage;
using Hangfire.Server;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Infrastructure.BackgroundJobs;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
public class LogHangfireJobActivityAttribute : JobFilterAttribute, IServerFilter, IApplyStateFilter
{
    private readonly ILogger<LogHangfireJobActivityAttribute> _logger;

    public LogHangfireJobActivityAttribute(ILogger<LogHangfireJobActivityAttribute> logger)
    {
        _logger = logger;
    }

    // IApplyStateFilter
    public void OnStateApplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
    {
        _logger.LogInformation(
            "Hangfire Job {JobId} changed state from {OldState} to {NewState}",
            context.BackgroundJob.Id,
            context.OldStateName,
            context.NewState.Name
        );
    }

    public void OnStateUnapplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
    {
        _logger.LogInformation(
            "Hangfire Job {JobId} state {OldState} unapplied",
            context.BackgroundJob.Id,
            context.OldStateName
        );
    }

    // IServerFilter
    public void OnPerforming(PerformingContext context)
    {
        _logger.LogInformation("Hangfire Job {JobId} is starting", context.BackgroundJob.Id);
    }

    public void OnPerformed(PerformedContext context)
    {
        _logger.LogInformation("Hangfire Job {JobId} finished", context.BackgroundJob.Id);
    }
}
