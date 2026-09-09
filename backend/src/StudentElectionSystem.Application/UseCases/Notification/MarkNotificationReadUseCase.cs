using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
namespace StudentElectionSystem.Application.UseCases.Notification;
public class MarkNotificationReadUseCase(INotificationRepository repository, ICurrentUserService currentUser) : IMarkNotificationReadUseCase
{
    public async Task ExecuteAsync(Guid notificationId, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        var notification = await repository.GetByIdForUserAsync(notificationId, userId, cancellationToken) ?? throw new NotFoundException("Notification not found.");
        notification.MarkAsRead();
        await repository.SaveChangesAsync(cancellationToken);
    }
}
