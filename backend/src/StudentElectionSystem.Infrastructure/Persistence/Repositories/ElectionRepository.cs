using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Domain.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class ElectionRepository : IElectionRepository
{
    private readonly AppDbContext _dbContext;

    public ElectionRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Election election, CancellationToken cancellationToken = default)
    {
        await _dbContext.Elections.AddAsync(election, cancellationToken);
    }

    public async Task<Election?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Elections
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<PagedResult<ElectionListItemDto>> GetPagedAsync(int pageNumber, int pageSize, string? search, ElectionStatus? status, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Elections.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(e => e.Title.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new ElectionListItemDto
            {
                Id = e.Id,
                Title = e.Title,
                Status = e.Status,
                NominationStartAt = e.NominationStartAt,
                NominationEndAt = e.NominationEndAt,
                VotingStartAt = e.VotingStartAt,
                VotingEndAt = e.VotingEndAt,
                MaxCandidates = e.MaxCandidates,
                CreatedAt = e.CreatedAt
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new PagedResult<ElectionListItemDto>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<ElectionDetailsDto?> GetDetailsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Elections
            .Where(e => e.Id == id)
            .Select(e => new ElectionDetailsDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Status = e.Status,
                NominationStartAt = e.NominationStartAt,
                NominationEndAt = e.NominationEndAt,
                VotingStartAt = e.VotingStartAt,
                VotingEndAt = e.VotingEndAt,
                MaxCandidates = e.MaxCandidates,
                CreatedByAdminId = e.CreatedByAdminId,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
