namespace ShoppingProject.Domain.Enums;

public static class ServiceBusConst
{
    public const string ProductAddedEventQueueName = "product-added-event-queue";
    public const string ProductUpdatedEventQueueName = "product-updated-event-queue";
    public const string ProductDeletedEventQueueName = "product-deleted-event-queue";
}
