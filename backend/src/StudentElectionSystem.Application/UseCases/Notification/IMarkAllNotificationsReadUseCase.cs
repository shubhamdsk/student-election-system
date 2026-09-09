namespace StudentElectionSystem.Application.UseCases.Notification;
public interface IMarkAllNotificationsReadUseCase { Task ExecuteAsync(CancellationToken cancellationToken = default); }
