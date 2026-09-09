using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.DTOs.Candidate;
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

    public async Task<IEnumerable<Candidate>> GetApplicationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .Include(c => c.Election)
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Candidate> Items, int TotalCount)> GetPendingCandidatesAsync(
        int page,
        int pageSize,
        string? search,
        Guid? electionId,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Candidates
            .Include(c => c.Election)
            .Include(c => c.Student)
            .Where(c => !c.IsApproved && !c.IsRejected)
            .AsQueryable();

        if (electionId.HasValue)
        {
            query = query.Where(c => c.ElectionId == electionId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToUpperInvariant();
            query = query.Where(c =>
                c.Student.FullName.ToUpper().Contains(normalizedSearch) ||
                c.Student.RegistrationNumber.ToUpper().Contains(normalizedSearch) ||
                c.Election.Title.ToUpper().Contains(normalizedSearch) ||
                _dbContext.Users.Any(u =>
                    u.Id == c.Student.UserId &&
                    u.NormalizedEmail.Contains(normalizedSearch)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .ThenBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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

    public async Task<IEnumerable<Candidate>> GetApprovedCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Candidates
            .Include(c => c.Student)
            .Where(c => c.ElectionId == electionId && c.IsApproved)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
