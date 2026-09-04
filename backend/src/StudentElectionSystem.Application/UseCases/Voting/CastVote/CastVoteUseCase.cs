using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Voting.CastVote;

public class CastVoteUseCase : ICastVoteUseCase
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;
    private readonly IElectionRepository _electionRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly IVoteRepository _voteRepository;
    private readonly IElectionParticipationRepository _participationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CastVoteUseCase(
        ICurrentUserService currentUserService,
        IStudentRepository studentRepository,
        IElectionRepository electionRepository,
        ICandidateRepository candidateRepository,
        IVoteRepository voteRepository,
        IElectionParticipationRepository participationRepository,
        IUnitOfWork unitOfWork)
    {
        _currentUserService = currentUserService;
        _studentRepository = studentRepository;
        _electionRepository = electionRepository;
        _candidateRepository = candidateRepository;
        _voteRepository = voteRepository;
        _participationRepository = participationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task ExecuteAsync(Guid electionId, CastVoteRequest request, CancellationToken cancellationToken = default)
    {
        // 1. Resolve Student
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken);
        if (student == null || student.ApprovalStatus != ApprovalStatus.Approved)
        {
            throw new ConflictException("You must be an approved student to vote.");
        }

        // 2. Load Election & Verify Voting state
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        if (election == null)
            throw new NotFoundException("Election not found.");

        if (election.Status != ElectionStatus.Voting)
        {
            throw new ConflictException("This election is not currently open for voting.");
        }

        // 3. Verify Candidate
        var candidate = await _candidateRepository.GetByIdAsync(request.CandidateId, cancellationToken);
        if (candidate == null || candidate.ElectionId != electionId)
        {
            throw new NotFoundException("Candidate not found in this election.");
        }

        if (!candidate.IsApproved)
        {
            throw new ConflictException("You cannot vote for a candidate who is not approved.");
        }

        // 4. Pre-check Participation
        var hasVoted = await _participationRepository.HasVotedAsync(student.Id, election.Id, cancellationToken);
        if (hasVoted)
        {
            throw new ConflictException("You have already voted in this election.");
        }

        // 5. Atomic Transaction
        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            // Create immutable participation record (who + when)
            var participation = new ElectionParticipation(student.Id, election.Id);
            await _participationRepository.AddAsync(participation, cancellationToken);

            // Create anonymous ballot (who receives it + when)
            var vote = new Vote(election.Id, candidate.Id);
            await _voteRepository.AddAsync(vote, cancellationToken);

            // Save changes to trigger DB constraints (throws ConflictException on race condition duplicate)
            await _unitOfWork.SaveChangesWithConflictCheckAsync(cancellationToken);

            // Commit transaction
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}
