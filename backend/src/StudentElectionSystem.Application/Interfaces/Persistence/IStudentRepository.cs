using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IStudentRepository
{
    Task<bool> ExistsByRegistrationNumberAsync(string registrationNumber, CancellationToken cancellationToken = default);
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
