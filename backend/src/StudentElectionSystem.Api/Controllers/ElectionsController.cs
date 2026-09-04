using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.UseCases.Election.Create;
using StudentElectionSystem.Application.UseCases.Election.GetList;
using StudentElectionSystem.Application.UseCases.Election.GetDetails;
using StudentElectionSystem.Application.UseCases.Election.Update;
using StudentElectionSystem.Application.UseCases.Election.Cancel;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ElectionsController : ControllerBase
{
    private readonly ICreateElectionUseCase _createElectionUseCase;
    private readonly IGetElectionsUseCase _getElectionsUseCase;
    private readonly IGetElectionDetailsUseCase _getElectionDetailsUseCase;
    private readonly IUpdateElectionUseCase _updateElectionUseCase;
    private readonly ICancelElectionUseCase _cancelElectionUseCase;

    public ElectionsController(
        ICreateElectionUseCase createElectionUseCase,
        IGetElectionsUseCase getElectionsUseCase,
        IGetElectionDetailsUseCase getElectionDetailsUseCase,
        IUpdateElectionUseCase updateElectionUseCase,
        ICancelElectionUseCase cancelElectionUseCase)
    {
        _createElectionUseCase = createElectionUseCase;
        _getElectionsUseCase = getElectionsUseCase;
        _getElectionDetailsUseCase = getElectionDetailsUseCase;
        _updateElectionUseCase = updateElectionUseCase;
        _cancelElectionUseCase = cancelElectionUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateElectionRequest request, CancellationToken cancellationToken)
    {
        var result = await _createElectionUseCase.ExecuteAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetDetails), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ElectionListItemDto>>> GetList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] ElectionStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _getElectionsUseCase.ExecuteAsync(pageNumber, pageSize, search, status, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ElectionDetailsDto>> GetDetails([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _getElectionDetailsUseCase.ExecuteAsync(id, cancellationToken);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateElectionRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _updateElectionUseCase.ExecuteAsync(id, request, cancellationToken);
            return Ok();
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

    [HttpPut("{id}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Cancel([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await _cancelElectionUseCase.ExecuteAsync(id, cancellationToken);
            return Ok();
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
