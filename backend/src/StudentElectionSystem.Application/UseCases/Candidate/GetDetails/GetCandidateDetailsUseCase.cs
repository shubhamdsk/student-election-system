using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetDetails;

public class GetCandidateDetailsUseCase : IGetCandidateDetailsUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IUserRepository _userRepository;

    public GetCandidateDetailsUseCase(ICandidateRepository candidateRepository, IUserRepository userRepository)
    {
        _candidateRepository = candidateRepository;
        _userRepository = userRepository;
    }

    public async Task<CandidateDetailsDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var candidate = await _candidateRepository.GetCandidateWithDetailsAsync(id, cancellationToken);
        if (candidate == null)
            return null;

        var studentEmail = string.Empty;
        if (candidate.Student != null)
        {
            var user = await _userRepository.GetByIdAsync(candidate.Student.UserId, cancellationToken);
            studentEmail = user?.Email ?? string.Empty;
        }

        return new CandidateDetailsDto
        {
            CandidateId = candidate.Id,
            ElectionId = candidate.ElectionId,
            ElectionTitle = candidate.Election?.Title ?? "Unknown",
            ElectionStatus = candidate.Election?.Status.ToString() ?? "Unknown",
            StudentId = candidate.StudentId,
            StudentFullName = candidate.Student?.FullName ?? "Unknown",
            StudentRegistrationNumber = candidate.Student?.RegistrationNumber ?? "Unknown",
            StudentEmail = studentEmail,
            Status = GetCandidateStatus(candidate),
            Manifesto = candidate.Manifesto,
            NominatedAt = candidate.NominatedAt,
            ApprovedAt = candidate.ApprovedAt,
            ApprovedByAdminId = candidate.ApprovedByAdminId,
            RejectedAt = candidate.RejectedAt,
            RejectionReason = candidate.RejectionReason
        };
    }

    private static string GetCandidateStatus(Domain.Entities.Candidate candidate)
    {
        if (candidate.IsApproved) return "Approved";
        if (candidate.IsRejected) return "Rejected";
        return "Pending";
    }
}
