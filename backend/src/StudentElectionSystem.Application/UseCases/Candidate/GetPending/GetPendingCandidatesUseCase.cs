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

    public GetPendingCandidatesUseCase(ICandidateRepository candidateRepository)
    {
        _candidateRepository = candidateRepository;
    }

    public async Task<PagedResult<PendingCandidateDto>> ExecuteAsync(
        int pageNumber,
        int pageSize,
        string? search,
        Guid? electionId,
        CancellationToken cancellationToken = default)
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Max(1, Math.Min(pageSize, 100));
        search = string.IsNullOrWhiteSpace(search) ? null : search.Trim();

        var (items, totalCount) = await _candidateRepository.GetPendingCandidatesAsync(
            pageNumber,
            pageSize,
            search,
            electionId,
            cancellationToken);

        return new PagedResult<PendingCandidateDto>(items, pageNumber, pageSize, totalCount);
    }
}
