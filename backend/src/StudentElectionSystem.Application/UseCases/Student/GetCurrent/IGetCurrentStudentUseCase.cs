using StudentElectionSystem.Application.DTOs.Student;

namespace StudentElectionSystem.Application.UseCases.Student.GetCurrent;

public interface IGetCurrentStudentUseCase
{
    Task<CurrentStudentProfileDto> ExecuteAsync(CancellationToken cancellationToken = default);
}
