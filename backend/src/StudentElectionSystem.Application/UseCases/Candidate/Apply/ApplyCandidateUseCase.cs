using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Apply;

public class ApplyCandidateUseCase : IApplyCandidateUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IElectionRepository _electionRepository;
    private readonly ICurrentUserService _currentUserService;

    public ApplyCandidateUseCase(
        ICandidateRepository candidateRepository,
        IStudentRepository studentRepository,
        IElectionRepository electionRepository,
        ICurrentUserService currentUserService)
    {
        _candidateRepository = candidateRepository;
        _studentRepository = studentRepository;
        _electionRepository = electionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<MyCandidateApplicationDto> ExecuteAsync(Guid electionId, ApplyCandidateRequest request, CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        // 1. Get the student profile for the authenticated user
        var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Student profile", userId);

        // 2. Verify student is approved
        if (student.ApprovalStatus != ApprovalStatus.Approved)
            throw new ConflictException("Only approved students can apply as candidates.");

        // 3. Get the election
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Election), electionId);

        // 4. Verify election is in Nominations phase
        if (election.Status != ElectionStatus.Nominations)
            throw new ConflictException($"Cannot apply to an election with status '{election.Status}'. The election must be in 'Nominations' phase.");

        // 5. Check duplicate application
        var alreadyApplied = await _candidateRepository.HasStudentAppliedToElectionAsync(student.Id, electionId, cancellationToken);
        if (alreadyApplied)
            throw new ConflictException("You have already applied as a candidate for this election.");

        // 6. Check MaxCandidates limit (count non-rejected candidates)
        if (election.MaxCandidates.HasValue)
        {
            var currentCount = await _candidateRepository.CountCandidatesByElectionIdAsync(electionId, cancellationToken);
            if (currentCount >= election.MaxCandidates.Value)
                throw new ConflictException($"This election has reached the maximum number of candidates ({election.MaxCandidates.Value}).");
        }

        // 7. Create the candidate
        var candidate = new Domain.Entities.Candidate(student.Id, electionId, request.Manifesto);
        
        await _candidateRepository.AddAsync(candidate, cancellationToken);
        await _candidateRepository.SaveChangesAsync(cancellationToken);

        return new MyCandidateApplicationDto
        {
            CandidateId = candidate.Id,
            ElectionId = electionId,
            ElectionTitle = election.Title,
            Status = "Pending",
            Manifesto = candidate.Manifesto,
            CreatedAt = candidate.CreatedAt
        };
    }
}
