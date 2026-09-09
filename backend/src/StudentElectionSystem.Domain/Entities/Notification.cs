using StudentElectionSystem.Domain.Common;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Domain.Entities;

public sealed class Notification : BaseEntity
{
    private Notification() { }

    public Notification(Guid userId, NotificationType type, string title, string message, Guid? relatedEntityId = null, NotificationEntityType? relatedEntityType = null)
    {
        UserId = userId;
        Type = type;
        Title = title;
        Message = message;
        RelatedEntityId = relatedEntityId;
        RelatedEntityType = relatedEntityType;
    }

    public Guid UserId { get; private set; }
    public NotificationType Type { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public Guid? RelatedEntityId { get; private set; }
    public NotificationEntityType? RelatedEntityType { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime? ReadAt { get; private set; }
    public User User { get; private set; } = null!;

    public void MarkAsRead()
    {
        if (IsRead) return;
        IsRead = true;
        ReadAt = DateTime.UtcNow;
        MarkUpdated();
    }
}
