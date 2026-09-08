using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Enums;
using StudentElectionSystem.Application.Exceptions;

namespace StudentElectionSystem.Application.UseCases.Election.GetDetails;

public class GetElectionDetailsUseCase : IGetElectionDetailsUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetElectionDetailsUseCase(IElectionRepository electionRepository, ICurrentUserService currentUserService)
    {
        _electionRepository = electionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ElectionDetailsDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        IReadOnlyCollection<ElectionStatus>? allowedStatuses = null;
        var isStudent = _currentUserService.Role == "Student";

        if (isStudent)
        {
            allowedStatuses = new[]
            {
                ElectionStatus.Nominations,
                ElectionStatus.Voting,
                ElectionStatus.Closed,
                ElectionStatus.ResultPublished
            };
        }

        var result = await _electionRepository.GetDetailsByIdAsync(id, allowedStatuses, cancellationToken);

        if (result == null)
        {
            throw new NotFoundException($"Election with ID '{id}' was not found.");
        }

        if (isStudent)
        {
            result.CreatedByAdminId = null;
        }

        return result;
    }
}
