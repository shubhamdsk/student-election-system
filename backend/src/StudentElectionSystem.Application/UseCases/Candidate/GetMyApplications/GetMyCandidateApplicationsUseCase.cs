using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetMyApplications;

public class GetMyCandidateApplicationsUseCase : IGetMyCandidateApplicationsUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyCandidateApplicationsUseCase(
        ICandidateRepository candidateRepository,
        IStudentRepository studentRepository,
        ICurrentUserService currentUserService)
    {
        _candidateRepository = candidateRepository;
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<MyCandidateApplicationDto>> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Student profile", userId);

        var candidates = await _candidateRepository.GetApplicationsByStudentIdAsync(student.Id, cancellationToken);

        return candidates.Select(c => new MyCandidateApplicationDto
        {
            CandidateId = c.Id,
            ElectionId = c.ElectionId,
            ElectionTitle = c.Election?.Title ?? "Unknown",
            Status = GetCandidateStatus(c),
            Manifesto = c.Manifesto,
            CreatedAt = c.CreatedAt,
            ApprovedAt = c.ApprovedAt,
            RejectedAt = c.RejectedAt,
            RejectionReason = c.RejectionReason
        });
    }

    private static string GetCandidateStatus(Domain.Entities.Candidate candidate)
    {
        if (candidate.IsApproved) return "Approved";
        if (candidate.IsRejected) return "Rejected";
        return "Pending";
    }
}
