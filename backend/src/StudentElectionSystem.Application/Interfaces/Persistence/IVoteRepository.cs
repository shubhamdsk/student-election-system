using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IVoteRepository
{
    Task AddAsync(Vote vote, CancellationToken cancellationToken = default);
}
