using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.UseCases.Student;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IRegisterStudentUseCase _registerStudentUseCase;

    public StudentsController(IRegisterStudentUseCase registerStudentUseCase)
    {
        _registerStudentUseCase = registerStudentUseCase;
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
}
