using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Notification;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;

namespace StudentElectionSystem.Application.UseCases.Notification;
public class GetMyNotificationsUseCase(INotificationRepository repository, ICurrentUserService currentUser) : IGetMyNotificationsUseCase
{
    public Task<PagedResult<NotificationDto>> ExecuteAsync(int pageNumber, int pageSize, bool? isRead, CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        return repository.GetPagedByUserAsync(userId, Math.Max(1, pageNumber), Math.Clamp(pageSize, 1, 100), isRead, cancellationToken);
    }
}
