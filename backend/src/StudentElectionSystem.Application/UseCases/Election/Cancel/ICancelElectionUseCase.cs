using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Cancel;

public interface ICancelElectionUseCase
{
    Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default);
}
