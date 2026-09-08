using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;

namespace StudentElectionSystem.Application.UseCases.Voting.GetParticipation;

public class GetVotingParticipationUseCase : IGetVotingParticipationUseCase
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;
    private readonly IElectionRepository _electionRepository;
    private readonly IElectionParticipationRepository _participationRepository;

    public GetVotingParticipationUseCase(
        ICurrentUserService currentUserService,
        IStudentRepository studentRepository,
        IElectionRepository electionRepository,
        IElectionParticipationRepository participationRepository)
    {
        _currentUserService = currentUserService;
        _studentRepository = studentRepository;
        _electionRepository = electionRepository;
        _participationRepository = participationRepository;
    }

    public async Task<VotingParticipationDto> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated.");
        
        var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Student profile", userId);

        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken)
            ?? throw new NotFoundException("Election not found.");

        var hasVoted = await _participationRepository.HasVotedAsync(student.Id, election.Id, cancellationToken);
        return new VotingParticipationDto(hasVoted);
    }
}
