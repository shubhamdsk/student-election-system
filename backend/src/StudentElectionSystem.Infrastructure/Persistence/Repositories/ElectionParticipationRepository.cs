using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class ElectionParticipationRepository : IElectionParticipationRepository
{
    private readonly AppDbContext _context;

    public ElectionParticipationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ElectionParticipation participation, CancellationToken cancellationToken = default)
    {
        await _context.ElectionParticipations.AddAsync(participation, cancellationToken);
    }

    public async Task<bool> HasVotedAsync(Guid studentId, Guid electionId, CancellationToken cancellationToken = default)
    {
        return await _context.ElectionParticipations
            .AnyAsync(ep => ep.StudentId == studentId && ep.ElectionId == electionId, cancellationToken);
    }
}
