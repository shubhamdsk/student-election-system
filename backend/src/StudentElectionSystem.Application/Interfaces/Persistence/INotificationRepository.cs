using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Notification;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface INotificationRepository
{
    Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default);
    Task<PagedResult<NotificationDto>> GetPagedByUserAsync(Guid userId, int pageNumber, int pageSize, bool? isRead, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Notification?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task MarkAllReadAsync(Guid userId, DateTime readAt, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
