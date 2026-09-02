using StudentElectionSystem.Application.DTOs.Authentication;

namespace StudentElectionSystem.Application.UseCases.Authentication;

public interface ILoginUseCase
{
    Task<LoginResponse?> ExecuteAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
