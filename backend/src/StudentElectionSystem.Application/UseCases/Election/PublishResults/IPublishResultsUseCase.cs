using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.PublishResults;

public interface IPublishResultsUseCase
{
    Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
