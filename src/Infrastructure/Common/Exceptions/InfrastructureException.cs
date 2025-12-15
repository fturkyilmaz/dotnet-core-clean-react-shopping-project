using System;

namespace ShoppingProject.Infrastructure.Common.Exceptions
{
    /// <summary>
    /// Custom exception type for Infrastructure layer errors.
    /// Provides contextual information when rethrowing exceptions.
    /// </summary>
    public class InfrastructureException : Exception
    {
        public InfrastructureException(string message)
            : base(message) { }

        public InfrastructureException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
