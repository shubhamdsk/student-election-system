using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.Exceptions;

namespace StudentElectionSystem.Api.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "An exception occurred while processing request: {Message}", exception.Message);

        var (statusCode, message) = exception switch
        {
            NotFoundException notFound => (StatusCodes.Status404NotFound, notFound.Message),
            ConflictException conflict => (StatusCodes.Status409Conflict, conflict.Message),
            ArgumentException argument => (StatusCodes.Status400BadRequest, argument.Message),
            UnauthorizedAccessException unauthorized => (StatusCodes.Status403Forbidden, unauthorized.Message),
            DbUpdateException dbEx when IsUniqueConstraintViolation(dbEx) => 
                (StatusCodes.Status409Conflict, "A record with the same unique identifier or data already exists."),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse.Failure(message);
        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex)
    {
        var sqlException = ex.InnerException as Microsoft.Data.SqlClient.SqlException;
        return sqlException != null && (sqlException.Number == 2601 || sqlException.Number == 2627);
    }
}
