using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;

namespace StudentElectionSystem.Application.UseCases.Voting.CastVote;

public interface ICastVoteUseCase
{
    Task ExecuteAsync(Guid electionId, CastVoteRequest request, CancellationToken cancellationToken = default);
}
