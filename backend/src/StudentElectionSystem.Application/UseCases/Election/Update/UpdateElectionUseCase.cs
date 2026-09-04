using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Update;

public class UpdateElectionUseCase : IUpdateElectionUseCase
{
    private readonly IElectionRepository _electionRepository;

    public UpdateElectionUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task ExecuteAsync(Guid id, UpdateElectionRequest request, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(id, cancellationToken);
        if (election == null)
            throw new NotFoundException(nameof(Domain.Entities.Election), id);

        if (election.Status != ElectionStatus.Draft)
            throw new ConflictException("Only Draft elections can be updated.");

        try
        {
            election.UpdateDetails(request.Title, request.Description, request.MaxCandidates);
            election.UpdateSchedule(request.NominationStartAt, request.NominationEndAt, request.VotingStartAt, request.VotingEndAt);
            
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
        catch (ArgumentException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
