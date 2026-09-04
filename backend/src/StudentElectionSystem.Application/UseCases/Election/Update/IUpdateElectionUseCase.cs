using StudentElectionSystem.Application.DTOs.Election;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Update;

public interface IUpdateElectionUseCase
{
    Task ExecuteAsync(Guid id, UpdateElectionRequest request, CancellationToken cancellationToken = default);
}
