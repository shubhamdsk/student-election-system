using StudentElectionSystem.Application.DTOs.Election;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.Create;

public interface ICreateElectionUseCase
{
    Task<ElectionDetailsDto> ExecuteAsync(CreateElectionRequest request, CancellationToken cancellationToken = default);
}
