using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Notification;

namespace StudentElectionSystem.Application.UseCases.Notification;
public interface IGetMyNotificationsUseCase { Task<PagedResult<NotificationDto>> ExecuteAsync(int pageNumber, int pageSize, bool? isRead, CancellationToken cancellationToken = default); }
