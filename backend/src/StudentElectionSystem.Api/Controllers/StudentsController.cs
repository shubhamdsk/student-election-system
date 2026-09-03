using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.UseCases.Student;
using Microsoft.AspNetCore.Authorization;
using System;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IRegisterStudentUseCase _registerStudentUseCase;
    private readonly IGetPendingStudentsUseCase _getPendingStudentsUseCase;
    private readonly IGetStudentDetailsUseCase _getStudentDetailsUseCase;
    private readonly IApproveStudentUseCase _approveStudentUseCase;
    private readonly IRejectStudentUseCase _rejectStudentUseCase;

    public StudentsController(
        IRegisterStudentUseCase registerStudentUseCase,
        IGetPendingStudentsUseCase getPendingStudentsUseCase,
        IGetStudentDetailsUseCase getStudentDetailsUseCase,
        IApproveStudentUseCase approveStudentUseCase,
        IRejectStudentUseCase rejectStudentUseCase)
    {
        _registerStudentUseCase = registerStudentUseCase;
        _getPendingStudentsUseCase = getPendingStudentsUseCase;
        _getStudentDetailsUseCase = getStudentDetailsUseCase;
        _approveStudentUseCase = approveStudentUseCase;
        _rejectStudentUseCase = rejectStudentUseCase;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterStudentRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _registerStudentUseCase.ExecuteAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingStudents(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _getPendingStudentsUseCase.ExecuteAsync(pageNumber, pageSize, search, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStudentDetails(
        [FromRoute] Guid id, 
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _getStudentDetailsUseCase.ExecuteAsync(id, cancellationToken);
            return Ok(result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ApproveStudent(
        [FromRoute] Guid id, 
        CancellationToken cancellationToken)
    {
        try
        {
            await _approveStudentUseCase.ExecuteAsync(id, cancellationToken);
            return Ok(new { Message = "Student approved successfully." });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RejectStudent(
        [FromRoute] Guid id, 
        [FromBody] RejectStudentRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            await _rejectStudentUseCase.ExecuteAsync(id, request, cancellationToken);
            return Ok(new { Message = "Student rejected successfully." });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ConflictException ex)
        {
            return Conflict(new { Message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
