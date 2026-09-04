using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Cancel;

public class CancelElectionUseCase : ICancelElectionUseCase
{
    private readonly IElectionRepository _electionRepository;

    public CancelElectionUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(id, cancellationToken);
        if (election == null)
            throw new NotFoundException(nameof(Domain.Entities.Election), id);

        try
        {
            election.Cancel();
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
