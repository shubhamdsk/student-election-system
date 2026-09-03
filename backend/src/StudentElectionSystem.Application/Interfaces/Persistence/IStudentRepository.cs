using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Student;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IStudentRepository
{
    Task<bool> ExistsByRegistrationNumberAsync(string registrationNumber, CancellationToken cancellationToken = default);
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
    Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<PendingStudentDto>> GetPendingStudentsAsync(int pageNumber, int pageSize, string? search, CancellationToken cancellationToken = default);
    Task<StudentDetailsDto?> GetStudentDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
