using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.UseCases.Election.Cancel;
using StudentElectionSystem.Application.UseCases.Election.CloseVoting;
using StudentElectionSystem.Application.UseCases.Election.Create;
using StudentElectionSystem.Application.UseCases.Election.GetDetails;
using StudentElectionSystem.Application.UseCases.Election.GetList;
using StudentElectionSystem.Application.UseCases.Election.OpenNominations;
using StudentElectionSystem.Application.UseCases.Election.PublishResults;
using StudentElectionSystem.Application.UseCases.Election.Update;
using StudentElectionSystem.Application.UseCases.Voting.StartVoting;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/elections")]
[Authorize(Roles = "Admin")]
public class ElectionsController : ControllerBase
{
    private readonly ICreateElectionUseCase _createElectionUseCase;
    private readonly IGetElectionsUseCase _getElectionsUseCase;
    private readonly IGetElectionDetailsUseCase _getElectionDetailsUseCase;
    private readonly IUpdateElectionUseCase _updateElectionUseCase;
    private readonly ICancelElectionUseCase _cancelElectionUseCase;
    private readonly IOpenNominationsUseCase _openNominationsUseCase;
    private readonly IStartVotingUseCase _startVotingUseCase;
    private readonly ICloseVotingUseCase _closeVotingUseCase;
    private readonly IPublishResultsUseCase _publishResultsUseCase;

    public ElectionsController(
        ICreateElectionUseCase createElectionUseCase,
        IGetElectionsUseCase getElectionsUseCase,
        IGetElectionDetailsUseCase getElectionDetailsUseCase,
        IUpdateElectionUseCase updateElectionUseCase,
        ICancelElectionUseCase cancelElectionUseCase,
        IOpenNominationsUseCase openNominationsUseCase,
        IStartVotingUseCase startVotingUseCase,
        ICloseVotingUseCase closeVotingUseCase,
        IPublishResultsUseCase publishResultsUseCase)
    {
        _createElectionUseCase = createElectionUseCase;
        _getElectionsUseCase = getElectionsUseCase;
        _getElectionDetailsUseCase = getElectionDetailsUseCase;
        _updateElectionUseCase = updateElectionUseCase;
        _cancelElectionUseCase = cancelElectionUseCase;
        _openNominationsUseCase = openNominationsUseCase;
        _startVotingUseCase = startVotingUseCase;
        _closeVotingUseCase = closeVotingUseCase;
        _publishResultsUseCase = publishResultsUseCase;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ElectionDetailsDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateElectionRequest request, CancellationToken cancellationToken)
    {
        var result = await _createElectionUseCase.ExecuteAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetDetails), new { id = result.Id }, ApiResponse.Success(result, "Election created successfully."));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ElectionListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] ElectionStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _getElectionsUseCase.ExecuteAsync(pageNumber, pageSize, search, status, cancellationToken);
        return Ok(ApiResponse.Success(result, "Elections retrieved successfully."));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ElectionDetailsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetails([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _getElectionDetailsUseCase.ExecuteAsync(id, cancellationToken);
        if (result == null)
        {
            throw new NotFoundException($"Election with ID '{id}' was not found.");
        }

        return Ok(ApiResponse.Success(result, "Election details retrieved successfully."));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateElectionRequest request, CancellationToken cancellationToken)
    {
        await _updateElectionUseCase.ExecuteAsync(id, request, cancellationToken);
        return Ok(ApiResponse.Success("Election updated successfully."));
    }

    [HttpPut("{id}/cancel")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Cancel([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _cancelElectionUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Election cancelled successfully."));
    }

    [HttpPut("{id}/open-nominations")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> OpenNominations([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _openNominationsUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Nominations opened successfully."));
    }

    [HttpPut("{id}/start-voting")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> StartVoting([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _startVotingUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Voting started successfully."));
    }

    [HttpPut("{id}/close-voting")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CloseVoting([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _closeVotingUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Voting closed successfully."));
    }

    [HttpPut("{id}/publish-results")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> PublishResults([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await _publishResultsUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Results published successfully."));
    }
}
