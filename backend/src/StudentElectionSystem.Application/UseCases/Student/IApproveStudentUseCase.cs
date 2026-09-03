using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public interface IApproveStudentUseCase
{
    Task ExecuteAsync(Guid studentId, CancellationToken cancellationToken = default);
}
