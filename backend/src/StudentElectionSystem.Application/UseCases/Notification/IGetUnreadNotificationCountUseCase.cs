using StudentElectionSystem.Application.DTOs.Notification;
namespace StudentElectionSystem.Application.UseCases.Notification;
public interface IGetUnreadNotificationCountUseCase { Task<UnreadNotificationCountDto> ExecuteAsync(CancellationToken cancellationToken = default); }
