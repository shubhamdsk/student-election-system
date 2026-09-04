using StudentElectionSystem.Application.DTOs.Candidate;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetMyApplications;

public interface IGetMyCandidateApplicationsUseCase
{
    Task<IEnumerable<MyCandidateApplicationDto>> ExecuteAsync(CancellationToken cancellationToken = default);
}
