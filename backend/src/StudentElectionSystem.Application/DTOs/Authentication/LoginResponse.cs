using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Authentication;

public record LoginResponse(
    string AccessToken,
    Guid UserId,
    string Email,
    UserRole Role
);
