using System;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.GetList;

public class GetElectionsUseCase : IGetElectionsUseCase
{
    private readonly IElectionRepository _electionRepository;

    public GetElectionsUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task<PagedResult<ElectionListItemDto>> ExecuteAsync(int pageNumber, int pageSize, string? search, ElectionStatus? status, CancellationToken cancellationToken = default)
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Max(1, Math.Min(pageSize, 100));

        return await _electionRepository.GetPagedAsync(pageNumber, pageSize, search, status, cancellationToken);
    }
}
