using StudentElectionSystem.Application.DTOs.Student;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public interface IGetStudentDetailsUseCase
{
    Task<StudentDetailsDto> ExecuteAsync(Guid studentId, CancellationToken cancellationToken = default);
}
