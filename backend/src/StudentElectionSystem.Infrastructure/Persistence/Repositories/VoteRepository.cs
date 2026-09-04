using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class VoteRepository : IVoteRepository
{
    private readonly AppDbContext _context;

    public VoteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Vote vote, CancellationToken cancellationToken = default)
    {
        await _context.Votes.AddAsync(vote, cancellationToken);
    }

    public async Task<ElectionResultsDto?> GetElectionResultsAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _context.Elections
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == electionId, cancellationToken);
            
        if (election == null) return null;

        var candidatesQuery = _context.Candidates
            .Include(c => c.Student)
            .AsNoTracking()
            .Where(c => c.ElectionId == electionId && c.IsApproved);

        var votesQuery = _context.Votes
            .AsNoTracking()
            .Where(v => v.ElectionId == electionId);

        var candidates = await candidatesQuery.ToListAsync(cancellationToken);
        
        var voteCounts = await votesQuery
            .GroupBy(v => v.CandidateId)
            .Select(g => new { CandidateId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CandidateId, x => x.Count, cancellationToken);

        var candidateResults = candidates.Select(c => new ElectionResultCandidateDto(
            c.Id,
            c.Student!.FullName,
            c.Student.Department,
            c.Student.YearOfStudy,
            c.Manifesto,
            voteCounts.GetValueOrDefault(c.Id, 0),
            0,
            false
        )).OrderByDescending(c => c.VoteCount).ThenBy(c => c.FullName).ToList();

        int currentRank = 1;
        int currentVoteCount = -1;
        int itemsAtCurrentRank = 0;
        
        bool isTie = false;
        int highestVotes = candidateResults.FirstOrDefault()?.VoteCount ?? 0;
        
        var finalCandidates = new List<ElectionResultCandidateDto>();
        
        foreach (var c in candidateResults)
        {
            if (c.VoteCount != currentVoteCount)
            {
                currentRank += itemsAtCurrentRank;
                currentVoteCount = c.VoteCount;
                itemsAtCurrentRank = 1;
            }
            else
            {
                itemsAtCurrentRank++;
            }
            
            bool isWinner = c.VoteCount == highestVotes && highestVotes > 0;
            
            finalCandidates.Add(c with { Rank = currentRank, IsWinner = isWinner });
        }
        
        int winnersCount = finalCandidates.Count(c => c.IsWinner);
        if (winnersCount > 1)
        {
            isTie = true;
        }

        int totalVotes = voteCounts.Values.Sum();

        return new ElectionResultsDto(
            election.Id,
            election.Title,
            election.Status.ToString(),
            totalVotes,
            isTie,
            finalCandidates
        );
    }
}
