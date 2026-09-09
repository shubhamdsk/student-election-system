using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
namespace StudentElectionSystem.Application.UseCases.Notification;
public class MarkAllNotificationsReadUseCase(INotificationRepository repository, ICurrentUserService currentUser) : IMarkAllNotificationsReadUseCase
{
    public Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        return repository.MarkAllReadAsync(userId, DateTime.UtcNow, cancellationToken);
    }
}
