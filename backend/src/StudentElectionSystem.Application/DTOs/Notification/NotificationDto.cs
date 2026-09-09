using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Notification;

public sealed record NotificationDto(Guid Id, NotificationType Type, string Title, string Message, Guid? RelatedEntityId, NotificationEntityType? RelatedEntityType, bool IsRead, DateTime CreatedAt, DateTime? ReadAt);
