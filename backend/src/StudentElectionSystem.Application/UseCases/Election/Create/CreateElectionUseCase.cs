using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Create;

public class CreateElectionUseCase : ICreateElectionUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateElectionUseCase(IElectionRepository electionRepository, ICurrentUserService currentUserService)
    {
        _electionRepository = electionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ElectionDetailsDto> ExecuteAsync(CreateElectionRequest request, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId;

        var election = new Domain.Entities.Election(
            title: request.Title,
            description: request.Description,
            nominationStartAt: request.NominationStartAt,
            nominationEndAt: request.NominationEndAt,
            votingStartAt: request.VotingStartAt,
            votingEndAt: request.VotingEndAt,
            createdByAdminId: adminId.Value,
            maxCandidates: request.MaxCandidates
        );

        await _electionRepository.AddAsync(election, cancellationToken);
        await _electionRepository.SaveChangesAsync(cancellationToken);

        return new ElectionDetailsDto
        {
            Id = election.Id,
            Title = election.Title,
            Description = election.Description,
            Status = election.Status,
            NominationStartAt = election.NominationStartAt,
            NominationEndAt = election.NominationEndAt,
            VotingStartAt = election.VotingStartAt,
            VotingEndAt = election.VotingEndAt,
            MaxCandidates = election.MaxCandidates,
            CreatedByAdminId = election.CreatedByAdminId,
            CreatedAt = election.CreatedAt,
            UpdatedAt = election.UpdatedAt
        };
    }
}
