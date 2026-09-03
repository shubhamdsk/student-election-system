using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public class GetStudentDetailsUseCase : IGetStudentDetailsUseCase
{
    private readonly IStudentRepository _studentRepository;

    public GetStudentDetailsUseCase(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<StudentDetailsDto> ExecuteAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetStudentDetailsAsync(studentId, cancellationToken);
        
        if (student == null)
        {
            throw new NotFoundException(nameof(student), studentId);
        }

        return student;
    }
}
