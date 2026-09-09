using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IUserRepository _userRepository;

    public NotificationService(INotificationRepository notificationRepository, IStudentRepository studentRepository, IUserRepository userRepository)
    {
        _notificationRepository = notificationRepository;
        _studentRepository = studentRepository;
        _userRepository = userRepository;
    }

    public Task CreateForUserAsync(Guid userId, NotificationType type, string title, string message, Guid? relatedEntityId, NotificationEntityType? relatedEntityType, CancellationToken cancellationToken = default) =>
        _notificationRepository.AddRangeAsync([new Notification(userId, type, title, message, relatedEntityId, relatedEntityType)], cancellationToken);

    public async Task CreateForApprovedStudentsAsync(NotificationType type, string title, string message, Guid relatedEntityId, NotificationEntityType relatedEntityType, CancellationToken cancellationToken = default)
    {
        var userIds = await _studentRepository.GetApprovedStudentUserIdsAsync(cancellationToken);
        await AddForUsersAsync(userIds, type, title, message, relatedEntityId, relatedEntityType, cancellationToken);
    }

    public async Task CreateForAdminsAsync(NotificationType type, string title, string message, Guid relatedEntityId, NotificationEntityType relatedEntityType, CancellationToken cancellationToken = default)
    {
        var userIds = await _userRepository.GetActiveAdminIdsAsync(cancellationToken);
        await AddForUsersAsync(userIds, type, title, message, relatedEntityId, relatedEntityType, cancellationToken);
    }

    private Task AddForUsersAsync(IEnumerable<Guid> userIds, NotificationType type, string title, string message, Guid relatedEntityId, NotificationEntityType relatedEntityType, CancellationToken cancellationToken)
    {
        var notifications = userIds.Select(userId => new Notification(userId, type, title, message, relatedEntityId, relatedEntityType));
        return _notificationRepository.AddRangeAsync(notifications, cancellationToken);
    }
}
