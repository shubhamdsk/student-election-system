using StudentElectionSystem.Application.DTOs.Authentication;
using StudentElectionSystem.Application.Interfaces.Authentication;
using StudentElectionSystem.Application.Interfaces.Persistence;

namespace StudentElectionSystem.Application.UseCases.Authentication;

public class LoginUseCase : ILoginUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasherService _passwordHasherService;
    private readonly ITokenService _tokenService;

    public LoginUseCase(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasherService,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasherService = passwordHasherService;
        _tokenService = tokenService;
    }

    public async Task<LoginResponse?> ExecuteAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.ToUpperInvariant();

        var user = await _userRepository.GetByNormalizedEmailAsync(normalizedEmail, cancellationToken);

        if (user == null || !user.IsActive)
        {
            return null; // Let the controller return 401 Unauthorized
        }

        if (!_passwordHasherService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return null;
        }

        user.RecordLogin();
        await _userRepository.UpdateAsync(user, cancellationToken);

        var token = _tokenService.GenerateToken(user);

        return new LoginResponse(
            AccessToken: token,
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role
        );
    }
}
