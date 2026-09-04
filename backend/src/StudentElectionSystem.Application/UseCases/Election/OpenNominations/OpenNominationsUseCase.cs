using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.OpenNominations;

public class OpenNominationsUseCase : IOpenNominationsUseCase
{
    private readonly IElectionRepository _electionRepository;

    public OpenNominationsUseCase(IElectionRepository electionRepository)
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
            election.OpenNominations();
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
