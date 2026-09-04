using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Voting.GetVotingCandidates;

public class GetVotingCandidatesUseCase : IGetVotingCandidatesUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICandidateRepository _candidateRepository;

    public GetVotingCandidatesUseCase(IElectionRepository electionRepository, ICandidateRepository candidateRepository)
    {
        _electionRepository = electionRepository;
        _candidateRepository = candidateRepository;
    }

    public async Task<IEnumerable<VotingCandidateDto>> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        
        if (election == null)
            throw new NotFoundException("Election not found.");

        // Optionally, we could restrict this strictly to when Status == ElectionStatus.Voting,
        // but returning the list before voting starts or after it closes might be acceptable for display.
        // For strict compliance with the plan, we don't block the list, we just return eligible candidates.
        
        var candidates = await _candidateRepository.GetApprovedCandidatesByElectionIdAsync(electionId, cancellationToken);

        return candidates.Select(c => new VotingCandidateDto(
            c.Id,
            c.StudentId,
            c.Student.FullName,
            c.Student.Department,
            c.Student.YearOfStudy,
            c.Manifesto ?? string.Empty
        ));
    }
}
