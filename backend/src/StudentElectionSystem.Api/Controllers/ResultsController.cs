using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.UseCases.Election.GetResults;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/elections/{electionId}/[controller]")]
[Authorize] // No role restriction, let Use Case handle visibility
public class ResultsController : ControllerBase
{
    private readonly IGetElectionResultsUseCase _getElectionResultsUseCase;

    public ResultsController(IGetElectionResultsUseCase getElectionResultsUseCase)
    {
        _getElectionResultsUseCase = getElectionResultsUseCase;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ElectionResultsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> GetResults([FromRoute] Guid electionId, CancellationToken cancellationToken)
    {
        try
        {
            var results = await _getElectionResultsUseCase.ExecuteAsync(electionId, cancellationToken);
            return Ok(results);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }
}
