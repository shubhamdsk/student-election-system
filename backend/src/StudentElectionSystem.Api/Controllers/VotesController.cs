using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.UseCases.Voting.CastVote;
using StudentElectionSystem.Application.UseCases.Voting.GetVotingCandidates;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/elections/{electionId}/votes")]
[Authorize(Roles = "Student")]
public class VotesController : ControllerBase
{
    private readonly IGetVotingCandidatesUseCase _getVotingCandidatesUseCase;
    private readonly ICastVoteUseCase _castVoteUseCase;

    public VotesController(
        IGetVotingCandidatesUseCase getVotingCandidatesUseCase,
        ICastVoteUseCase castVoteUseCase)
    {
        _getVotingCandidatesUseCase = getVotingCandidatesUseCase;
        _castVoteUseCase = castVoteUseCase;
    }

    [HttpGet("candidates")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<VotingCandidateDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCandidates([FromRoute] Guid electionId, CancellationToken cancellationToken)
    {
        var candidates = await _getVotingCandidatesUseCase.ExecuteAsync(electionId, cancellationToken);
        return Ok(ApiResponse.Success(candidates, "Voting candidates retrieved successfully."));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CastVote([FromRoute] Guid electionId, [FromBody] CastVoteRequest request, CancellationToken cancellationToken)
    {
        await _castVoteUseCase.ExecuteAsync(electionId, request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Success("Vote cast successfully."));
    }
}
