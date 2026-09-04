using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Voting.StartVoting;

public interface IStartVotingUseCase
{
    Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
