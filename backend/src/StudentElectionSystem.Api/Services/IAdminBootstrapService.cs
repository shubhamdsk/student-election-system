using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Api.Services;

public interface IAdminBootstrapService
{
    Task EnsureAdminExistsAsync(CancellationToken cancellationToken = default);
}
