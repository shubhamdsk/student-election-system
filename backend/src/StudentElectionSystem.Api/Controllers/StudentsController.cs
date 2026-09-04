using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.UseCases.Student;
using StudentElectionSystem.Application.UseCases.Student.GetCurrent;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly IRegisterStudentUseCase _registerStudentUseCase;
    private readonly IGetPendingStudentsUseCase _getPendingStudentsUseCase;
    private readonly IGetStudentDetailsUseCase _getStudentDetailsUseCase;
    private readonly IApproveStudentUseCase _approveStudentUseCase;
    private readonly IRejectStudentUseCase _rejectStudentUseCase;
    private readonly IGetCurrentStudentUseCase _getCurrentStudentUseCase;

    public StudentsController(
        IRegisterStudentUseCase registerStudentUseCase,
        IGetPendingStudentsUseCase getPendingStudentsUseCase,
        IGetStudentDetailsUseCase getStudentDetailsUseCase,
        IApproveStudentUseCase approveStudentUseCase,
        IRejectStudentUseCase rejectStudentUseCase,
        IGetCurrentStudentUseCase getCurrentStudentUseCase)
    {
        _registerStudentUseCase = registerStudentUseCase;
        _getPendingStudentsUseCase = getPendingStudentsUseCase;
        _getStudentDetailsUseCase = getStudentDetailsUseCase;
        _approveStudentUseCase = approveStudentUseCase;
        _rejectStudentUseCase = rejectStudentUseCase;
        _getCurrentStudentUseCase = getCurrentStudentUseCase;
    }

    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    [ProducesResponseType(typeof(ApiResponse<CurrentStudentProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentStudent(CancellationToken cancellationToken)
    {
        var result = await _getCurrentStudentUseCase.ExecuteAsync(cancellationToken);
        return Ok(ApiResponse.Success(result, "Student profile retrieved successfully."));
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<RegisterStudentResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterStudentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _registerStudentUseCase.ExecuteAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(response, "Student registered successfully."));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PendingStudentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingStudents(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _getPendingStudentsUseCase.ExecuteAsync(pageNumber, pageSize, search, cancellationToken);
        return Ok(ApiResponse.Success(result, "Pending students retrieved successfully."));
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<StudentDetailsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStudentDetails(
        [FromRoute] Guid id, 
        CancellationToken cancellationToken)
    {
        var result = await _getStudentDetailsUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success(result, "Student details retrieved successfully."));
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ApproveStudent(
        [FromRoute] Guid id, 
        CancellationToken cancellationToken)
    {
        await _approveStudentUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(ApiResponse.Success("Student approved successfully."));
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RejectStudent(
        [FromRoute] Guid id, 
        [FromBody] RejectStudentRequest request,
        CancellationToken cancellationToken)
    {
        await _rejectStudentUseCase.ExecuteAsync(id, request, cancellationToken);
        return Ok(ApiResponse.Success("Student rejected successfully."));
    }
}
