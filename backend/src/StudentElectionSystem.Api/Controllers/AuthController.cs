using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Authentication;
using StudentElectionSystem.Application.UseCases.Authentication;

namespace StudentElectionSystem.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ILoginUseCase _loginUseCase;

    public AuthController(ILoginUseCase loginUseCase)
    {
        _loginUseCase = loginUseCase;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(ApiResponse.Failure("Email and password are required."));
        }

        var response = await _loginUseCase.ExecuteAsync(request, cancellationToken);

        if (response == null)
        {
            return Unauthorized(ApiResponse.Failure("Invalid credentials."));
        }

        return Ok(ApiResponse.Success(response, "Login successful."));
    }
}
