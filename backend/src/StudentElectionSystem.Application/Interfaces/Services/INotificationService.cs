using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.Interfaces.Services;

public interface INotificationService
{
    Task CreateForUserAsync(Guid userId, NotificationType type, string title, string message, Guid? relatedEntityId, NotificationEntityType? relatedEntityType, CancellationToken cancellationToken = default);
    Task CreateForApprovedStudentsAsync(NotificationType type, string title, string message, Guid relatedEntityId, NotificationEntityType relatedEntityType, CancellationToken cancellationToken = default);
    Task CreateForAdminsAsync(NotificationType type, string title, string message, Guid relatedEntityId, NotificationEntityType relatedEntityType, CancellationToken cancellationToken = default);
}
