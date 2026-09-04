using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.GetList;

public interface IGetElectionsUseCase
{
    Task<PagedResult<ElectionListItemDto>> ExecuteAsync(int pageNumber, int pageSize, string? search, ElectionStatus? status, CancellationToken cancellationToken = default);
}
