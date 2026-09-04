using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Common.Models;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetPending;

public interface IGetPendingCandidatesUseCase
{
    Task<PagedResult<PendingCandidateDto>> ExecuteAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
}
