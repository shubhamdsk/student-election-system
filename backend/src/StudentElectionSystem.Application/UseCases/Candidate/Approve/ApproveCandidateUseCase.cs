using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Approve;

public class ApproveCandidateUseCase : IApproveCandidateUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ICurrentUserService _currentUserService;

    public ApproveCandidateUseCase(ICandidateRepository candidateRepository, ICurrentUserService currentUserService)
    {
        _candidateRepository = candidateRepository;
        _currentUserService = currentUserService;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var candidate = await _candidateRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Candidate), id);

        try
        {
            candidate.Approve(adminId);
            await _candidateRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
