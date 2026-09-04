using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.UseCases.Candidate.Apply;
using StudentElectionSystem.Application.UseCases.Candidate.GetMyApplications;
using StudentElectionSystem.Application.UseCases.Candidate.GetPending;
using StudentElectionSystem.Application.UseCases.Candidate.GetDetails;
using StudentElectionSystem.Application.UseCases.Candidate.Approve;
using StudentElectionSystem.Application.UseCases.Candidate.Reject;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CandidatesController : ControllerBase
{
    private readonly IApplyCandidateUseCase _applyCandidateUseCase;
    private readonly IGetMyCandidateApplicationsUseCase _getMyCandidateApplicationsUseCase;
    private readonly IGetPendingCandidatesUseCase _getPendingCandidatesUseCase;
    private readonly IGetCandidateDetailsUseCase _getCandidateDetailsUseCase;
    private readonly IApproveCandidateUseCase _approveCandidateUseCase;
    private readonly IRejectCandidateUseCase _rejectCandidateUseCase;

    public CandidatesController(
        IApplyCandidateUseCase applyCandidateUseCase,
        IGetMyCandidateApplicationsUseCase getMyCandidateApplicationsUseCase,
        IGetPendingCandidatesUseCase getPendingCandidatesUseCase,
        IGetCandidateDetailsUseCase getCandidateDetailsUseCase,
        IApproveCandidateUseCase approveCandidateUseCase,
        IRejectCandidateUseCase rejectCandidateUseCase)
    {
        _applyCandidateUseCase = applyCandidateUseCase;
        _getMyCandidateApplicationsUseCase = getMyCandidateApplicationsUseCase;
        _getPendingCandidatesUseCase = getPendingCandidatesUseCase;
        _getCandidateDetailsUseCase = getCandidateDetailsUseCase;
        _approveCandidateUseCase = approveCandidateUseCase;
        _rejectCandidateUseCase = rejectCandidateUseCase;
    }

    // ── Student Endpoints ────────────────────────────────────────────────────

    /// <summary>
    /// Apply as a candidate for a specific election (Student only).
    /// </summary>
    [HttpPost("elections/{electionId}/apply")]
    [Authorize(Roles = "Student")]
    [ProducesResponseType(typeof(MyCandidateApplicationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Apply([FromRoute] Guid electionId, [FromBody] ApplyCandidateRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _applyCandidateUseCase.ExecuteAsync(electionId, request, cancellationToken);
            return CreatedAtAction(nameof(GetDetails), new { id = result.CandidateId }, result);
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (StudentElectionSystem.Application.Exceptions.ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    /// <summary>
    /// Get the authenticated student's own candidate applications (Student only).
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    [ProducesResponseType(typeof(IEnumerable<MyCandidateApplicationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyApplications(CancellationToken cancellationToken)
    {
        try
        {
            var result = await _getMyCandidateApplicationsUseCase.ExecuteAsync(cancellationToken);
            return Ok(result);
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    /// <summary>
    /// List all pending candidate nominations (Admin only).
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(PagedResult<PendingCandidateDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPending(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _getPendingCandidatesUseCase.ExecuteAsync(pageNumber, pageSize, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get candidate details by ID (Admin only).
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(CandidateDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetails([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _getCandidateDetailsUseCase.ExecuteAsync(id, cancellationToken);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// Approve a pending candidate nomination (Admin only).
    /// </summary>
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Approve([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await _approveCandidateUseCase.ExecuteAsync(id, cancellationToken);
            return Ok(new { Message = "Candidate approved successfully." });
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (StudentElectionSystem.Application.Exceptions.ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    /// <summary>
    /// Reject a pending candidate nomination (Admin only).
    /// </summary>
    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Reject([FromRoute] Guid id, [FromBody] RejectCandidateRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _rejectCandidateUseCase.ExecuteAsync(id, request, cancellationToken);
            return Ok(new { Message = "Candidate rejected successfully." });
        }
        catch (StudentElectionSystem.Application.Exceptions.NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (StudentElectionSystem.Application.Exceptions.ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }
}
