using System;

namespace ShoppingProject.Application.Common.Exceptions
{
    /// <summary>
    /// Represents errors that occur during persistence operations (e.g. database update failures).
    /// </summary>
    public class PersistenceException : Exception
    {
        public PersistenceException(string message)
            : base(message) { }

        public PersistenceException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
