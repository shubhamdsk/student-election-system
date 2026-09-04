using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Voting;

namespace StudentElectionSystem.Application.UseCases.Voting.GetVotingCandidates;

public interface IGetVotingCandidatesUseCase
{
    Task<IEnumerable<VotingCandidateDto>> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
