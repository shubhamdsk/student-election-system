using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;

namespace StudentElectionSystem.Application.UseCases.Voting.GetParticipation;

public interface IGetVotingParticipationUseCase
{
    Task<VotingParticipationDto> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
