using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.UseCases.Election.GetResults;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/elections/{electionId}/results")]
[Authorize]
public class ResultsController : ControllerBase
{
    private readonly IGetElectionResultsUseCase _getElectionResultsUseCase;

    public ResultsController(IGetElectionResultsUseCase getElectionResultsUseCase)
    {
        _getElectionResultsUseCase = getElectionResultsUseCase;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ElectionResultsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> GetResults([FromRoute] Guid electionId, CancellationToken cancellationToken)
    {
        var results = await _getElectionResultsUseCase.ExecuteAsync(electionId, cancellationToken);
        return Ok(ApiResponse.Success(results, "Election results retrieved successfully."));
    }
}
