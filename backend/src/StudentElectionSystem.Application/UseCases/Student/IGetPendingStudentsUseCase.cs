using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Student;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public interface IGetPendingStudentsUseCase
{
    Task<PagedResult<PendingStudentDto>> ExecuteAsync(int pageNumber, int pageSize, string? search, CancellationToken cancellationToken = default);
}
