using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IElectionRepository
{
    Task AddAsync(Election election, CancellationToken cancellationToken = default);
    Task<Election?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<ElectionListItemDto>> GetPagedAsync(int pageNumber, int pageSize, string? search, ElectionStatus? status, CancellationToken cancellationToken = default);
    Task<ElectionDetailsDto?> GetDetailsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
