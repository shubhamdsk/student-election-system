using StudentElectionSystem.Application.DTOs.Student;

namespace StudentElectionSystem.Application.UseCases.Student;

public interface IRegisterStudentUseCase
{
    Task<RegisterStudentResponse> ExecuteAsync(RegisterStudentRequest request, CancellationToken cancellationToken = default);
}
