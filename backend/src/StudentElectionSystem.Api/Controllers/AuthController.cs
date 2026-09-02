using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { Error = "Email and password are required." });
        }

        var response = await _loginUseCase.ExecuteAsync(request, cancellationToken);

        if (response == null)
        {
            return Unauthorized(new { Error = "Invalid credentials." });
        }

        return Ok(response);
    }
}
