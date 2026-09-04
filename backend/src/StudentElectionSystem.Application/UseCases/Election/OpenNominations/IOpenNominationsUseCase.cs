using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.OpenNominations;

public interface IOpenNominationsUseCase
{
    Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default);
}
