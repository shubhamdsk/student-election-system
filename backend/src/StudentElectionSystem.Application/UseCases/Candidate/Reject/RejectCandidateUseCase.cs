using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Reject;

public class RejectCandidateUseCase : IRejectCandidateUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ICurrentUserService _currentUserService;

    public RejectCandidateUseCase(ICandidateRepository candidateRepository, ICurrentUserService currentUserService)
    {
        _candidateRepository = candidateRepository;
        _currentUserService = currentUserService;
    }

    public async Task ExecuteAsync(Guid id, RejectCandidateRequest request, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var candidate = await _candidateRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Candidate), id);

        try
        {
            candidate.Reject(adminId, request.Reason);
            await _candidateRepository.SaveChangesAsync(cancellationToken);
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
