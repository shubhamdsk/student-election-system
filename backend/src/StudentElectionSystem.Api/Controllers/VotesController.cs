using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Application.UseCases.Voting.GetVotingCandidates;
using StudentElectionSystem.Application.UseCases.Voting.CastVote;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/elections/{electionId}/[controller]")]
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<VotingCandidateDto>>> GetCandidates([FromRoute] Guid electionId, CancellationToken cancellationToken)
    {
        try
        {
            var candidates = await _getVotingCandidatesUseCase.ExecuteAsync(electionId, cancellationToken);
            return Ok(candidates);
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CastVote([FromRoute] Guid electionId, [FromBody] CastVoteRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _castVoteUseCase.ExecuteAsync(electionId, request, cancellationToken);
            return Created(string.Empty, new { Message = "Vote cast successfully." });
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (StudentElectionSystem.Application.Exceptions.ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
