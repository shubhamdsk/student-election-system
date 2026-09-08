using System;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Enums;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Interfaces.Services;

namespace StudentElectionSystem.Application.UseCases.Election.GetList;

public class GetElectionsUseCase : IGetElectionsUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetElectionsUseCase(IElectionRepository electionRepository, ICurrentUserService currentUserService)
    {
        _electionRepository = electionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<ElectionListItemDto>> ExecuteAsync(int pageNumber, int pageSize, string? search, ElectionStatus? status, CancellationToken cancellationToken = default)
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Max(1, Math.Min(pageSize, 100));

        IReadOnlyCollection<ElectionStatus>? allowedStatuses = null;

        if (_currentUserService.Role == "Student")
        {
            allowedStatuses = new[]
            {
                ElectionStatus.Nominations,
                ElectionStatus.Voting,
                ElectionStatus.Closed,
                ElectionStatus.ResultPublished
            };

            if (status.HasValue && !allowedStatuses.Contains(status.Value))
            {
                return new PagedResult<ElectionListItemDto>(new List<ElectionListItemDto>(), pageNumber, pageSize, 0);
            }
        }

        return await _electionRepository.GetPagedAsync(pageNumber, pageSize, search, status, allowedStatuses, cancellationToken);
    }
}
