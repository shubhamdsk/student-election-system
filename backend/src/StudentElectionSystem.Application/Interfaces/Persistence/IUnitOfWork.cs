using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IUnitOfWork
{
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Saves changes and translates unique constraint violations into ConflictException.
    /// </summary>
    Task SaveChangesWithConflictCheckAsync(CancellationToken cancellationToken = default);
}