using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Notification;
using StudentElectionSystem.Application.UseCases.Notification;

namespace StudentElectionSystem.Api.Controllers;

[ApiController, Authorize, Route("api/notifications")]
public class NotificationsController(IGetMyNotificationsUseCase getNotifications, IGetUnreadNotificationCountUseCase getUnreadCount, IMarkNotificationReadUseCase markRead, IMarkAllNotificationsReadUseCase markAllRead) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] bool? isRead = null, CancellationToken cancellationToken = default) =>
        Ok(ApiResponse.Success(await getNotifications.ExecuteAsync(pageNumber, pageSize, isRead, cancellationToken), "Notifications retrieved successfully."));

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount(CancellationToken cancellationToken) =>
        Ok(ApiResponse.Success(await getUnreadCount.ExecuteAsync(cancellationToken), "Unread notification count retrieved successfully."));

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken cancellationToken) { await markRead.ExecuteAsync(id, cancellationToken); return Ok(ApiResponse.Success("Notification marked as read.")); }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken cancellationToken) { await markAllRead.ExecuteAsync(cancellationToken); return Ok(ApiResponse.Success("All notifications marked as read.")); }
}
