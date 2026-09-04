using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Election.GetResults;

public class GetElectionResultsUseCase : IGetElectionResultsUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly IVoteRepository _voteRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetElectionResultsUseCase(
        IElectionRepository electionRepository,
        IVoteRepository voteRepository,
        ICurrentUserService currentUserService)
    {
        _electionRepository = electionRepository;
        _voteRepository = voteRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ElectionResultsDto> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        if (election == null)
            throw new NotFoundException($"Election with ID '{electionId}' was not found.");

        if (election.Status == ElectionStatus.Draft || 
            election.Status == ElectionStatus.Nominations || 
            election.Status == ElectionStatus.Voting ||
            election.Status == ElectionStatus.Cancelled)
        {
            throw new ConflictException("Results are not yet available for this election.");
        }

        if (election.Status == ElectionStatus.Closed)
        {
            // Only Admin can preview when Closed
            var role = _currentUserService.Role;
            if (role != "Admin")
            {
                throw new ConflictException("Results are not yet published. Only administrators can preview them.");
            }
        }

        var results = await _voteRepository.GetElectionResultsAsync(electionId, cancellationToken);
        if (results == null)
            throw new NotFoundException($"Election results for ID '{electionId}' could not be generated.");

        return results;
    }
}
