using StudentElectionSystem.Application.Interfaces.Authentication;

namespace StudentElectionSystem.Infrastructure.Authentication;

public class PasswordHasherServiceImpl : IPasswordHasherService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.EnhancedHashPassword(password, 13);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.EnhancedVerify(password, passwordHash);
    }
}
