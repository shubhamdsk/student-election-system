using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Notification;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _dbContext;
    public NotificationRepository(AppDbContext dbContext) => _dbContext = dbContext;

    public Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default) =>
        _dbContext.Notifications.AddRangeAsync(notifications, cancellationToken);

    public async Task<PagedResult<NotificationDto>> GetPagedByUserAsync(Guid userId, int pageNumber, int pageSize, bool? isRead, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Notifications.AsNoTracking().Where(notification => notification.UserId == userId);
        if (isRead.HasValue) query = query.Where(notification => notification.IsRead == isRead.Value);
        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(notification => notification.CreatedAt).ThenByDescending(notification => notification.Id)
            .Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(notification => new NotificationDto(notification.Id, notification.Type, notification.Title, notification.Message, notification.RelatedEntityId, notification.RelatedEntityType, notification.IsRead, notification.CreatedAt, notification.ReadAt))
            .ToListAsync(cancellationToken);
        return new PagedResult<NotificationDto>(items, pageNumber, pageSize, totalCount);
    }

    public Task<int> GetUnreadCountByUserAsync(Guid userId, CancellationToken cancellationToken = default) =>
        _dbContext.Notifications.CountAsync(notification => notification.UserId == userId && !notification.IsRead, cancellationToken);

    public Task<Notification?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default) =>
        _dbContext.Notifications.FirstOrDefaultAsync(notification => notification.Id == id && notification.UserId == userId, cancellationToken);

    public Task MarkAllReadAsync(Guid userId, DateTime readAt, CancellationToken cancellationToken = default) =>
        _dbContext.Notifications.Where(notification => notification.UserId == userId && !notification.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(notification => notification.IsRead, true).SetProperty(notification => notification.ReadAt, readAt).SetProperty(notification => notification.UpdatedAt, readAt), cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => _dbContext.SaveChangesAsync(cancellationToken);
}
