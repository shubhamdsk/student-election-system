using StudentElectionSystem.Application.DTOs.Student;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public interface IRejectStudentUseCase
{
    Task ExecuteAsync(Guid studentId, RejectStudentRequest request, CancellationToken cancellationToken = default);
}
