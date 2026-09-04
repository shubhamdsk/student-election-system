using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.CloseVoting;

public interface ICloseVotingUseCase
{
    Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
