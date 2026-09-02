using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Authentication;

public interface ITokenService
{
    string GenerateToken(User user);
}
