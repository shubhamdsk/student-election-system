using StudentElectionSystem.Application.DTOs.Notification;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
namespace StudentElectionSystem.Application.UseCases.Notification;
public class GetUnreadNotificationCountUseCase(INotificationRepository repository, ICurrentUserService currentUser) : IGetUnreadNotificationCountUseCase
{
    public async Task<UnreadNotificationCountDto> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        return new UnreadNotificationCountDto(await repository.GetUnreadCountByUserAsync(userId, cancellationToken));
    }
}
