using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _dbContext;

    public CandidateRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Candidate candidate, CancellationToken cancellationToken = default)
    {
        await _dbContext.Candidates.AddAsync(candidate, cancellationToken);
    }

    public Task UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default)
    {
        _dbContext.Candidates.Update(candidate);
        return Task.CompletedTask;
    }

    public async Task<Candidate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<bool> HasStudentAppliedToElectionAsync(Guid studentId, Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .AnyAsync(c => c.StudentId == studentId && c.ElectionId == electionId, cancellationToken);
    }

    public async Task<int> CountCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .CountAsync(c => c.ElectionId == electionId && !c.IsRejected, cancellationToken);
    }

    public async Task<int> CountApprovedCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .CountAsync(c => c.ElectionId == electionId && c.IsApproved && !c.IsRejected, cancellationToken);
    }

    public async Task<IEnumerable<MyCandidateApplicationDto>> GetApplicationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new MyCandidateApplicationDto
            {
                CandidateId = c.Id,
                ElectionId = c.ElectionId,
                ElectionTitle = c.Election.Title,
                ElectionStatus = c.Election.Status,
                Status = c.IsApproved ? "Approved" : c.IsRejected ? "Rejected" : "Pending",
                Manifesto = c.Manifesto,
                CreatedAt = c.CreatedAt,
                ApprovedAt = c.ApprovedAt,
                RejectedAt = c.RejectedAt,
                RejectionReason = c.RejectionReason
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<PendingCandidateDto> Items, int TotalCount)> GetPendingCandidatesAsync(
        int page,
        int pageSize,
        string? search,
        Guid? electionId,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Candidates
            .Where(c => !c.IsApproved && !c.IsRejected)
            .AsQueryable();

        if (electionId.HasValue)
        {
            query = query.Where(c => c.ElectionId == electionId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim();
            query = query.Where(c =>
                c.Student.FullName.Contains(normalizedSearch) ||
                c.Student.RegistrationNumber.Contains(normalizedSearch) ||
                c.Election.Title.Contains(normalizedSearch) ||
                _dbContext.Users.Any(u =>
                    u.Id == c.Student.UserId &&
                    u.NormalizedEmail.Contains(normalizedSearch.ToUpperInvariant())));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .ThenBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new PendingCandidateDto
            {
                CandidateId = c.Id,
                ElectionId = c.ElectionId,
                ElectionTitle = c.Election.Title,
                StudentId = c.StudentId,
                StudentFullName = c.Student.FullName,
                StudentRegistrationNumber = c.Student.RegistrationNumber,
                StudentEmail = _dbContext.Users
                    .Where(u => u.Id == c.Student.UserId)
                    .Select(u => u.Email)
                    .FirstOrDefault() ?? string.Empty,
                NominatedAt = c.NominatedAt
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);
            
        return (items, totalCount);
    }

    public async Task<Candidate?> GetCandidateWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .Include(c => c.Student)
            .Include(c => c.Election)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<VotingCandidateDto>> GetApprovedCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .Where(c => c.ElectionId == electionId && c.IsApproved && !c.IsRejected)
            .Select(c => new VotingCandidateDto(
                c.Id,
                c.StudentId,
                c.Student.FullName,
                c.Student.Department,
                c.Student.YearOfStudy,
                c.Manifesto ?? string.Empty))
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
