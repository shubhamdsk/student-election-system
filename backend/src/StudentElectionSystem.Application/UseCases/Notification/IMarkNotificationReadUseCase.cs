namespace StudentElectionSystem.Application.UseCases.Notification;
public interface IMarkNotificationReadUseCase { Task ExecuteAsync(Guid notificationId, CancellationToken cancellationToken = default); }
