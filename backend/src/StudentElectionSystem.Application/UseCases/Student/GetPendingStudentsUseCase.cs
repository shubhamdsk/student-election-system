using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public class GetPendingStudentsUseCase : IGetPendingStudentsUseCase
{
    private readonly IStudentRepository _studentRepository;

    public GetPendingStudentsUseCase(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<PagedResult<PendingStudentDto>> ExecuteAsync(int pageNumber, int pageSize, string? search, CancellationToken cancellationToken = default)
    {
        // Default pagination if invalid values are provided
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;
        
        // Cap max page size to 100
        if (pageSize > 100) pageSize = 100;

        return await _studentRepository.GetPendingStudentsAsync(pageNumber, pageSize, search, cancellationToken);
    }
}
