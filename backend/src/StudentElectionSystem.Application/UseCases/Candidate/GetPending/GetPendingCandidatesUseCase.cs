using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetPending;

public class GetPendingCandidatesUseCase : IGetPendingCandidatesUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IUserRepository _userRepository;

    public GetPendingCandidatesUseCase(ICandidateRepository candidateRepository, IUserRepository userRepository)
    {
        _candidateRepository = candidateRepository;
        _userRepository = userRepository;
    }

    public async Task<PagedResult<PendingCandidateDto>> ExecuteAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Max(1, Math.Min(pageSize, 100));

        var (items, totalCount) = await _candidateRepository.GetPendingCandidatesAsync(pageNumber, pageSize, cancellationToken);

        var dtos = new List<PendingCandidateDto>();
        foreach (var c in items)
        {
            var studentEmail = string.Empty;
            if (c.Student != null)
            {
                var user = await _userRepository.GetByIdAsync(c.Student.UserId, cancellationToken);
                studentEmail = user?.Email ?? string.Empty;
            }

            dtos.Add(new PendingCandidateDto
            {
                CandidateId = c.Id,
                ElectionId = c.ElectionId,
                ElectionTitle = c.Election?.Title ?? "Unknown",
                StudentId = c.StudentId,
                StudentFullName = c.Student?.FullName ?? "Unknown",
                StudentRegistrationNumber = c.Student?.RegistrationNumber ?? "Unknown",
                StudentEmail = studentEmail,
                NominatedAt = c.NominatedAt
            });
        }

        return new PagedResult<PendingCandidateDto>(dtos, pageNumber, pageSize, totalCount);
    }
}
