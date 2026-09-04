using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StudentElectionSystem.Application.Interfaces.Authentication;
using StudentElectionSystem.Infrastructure.Authentication;
using StudentElectionSystem.Infrastructure.Persistence;

namespace StudentElectionSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IUserRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.UserRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IStudentRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.StudentRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IElectionRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.ElectionRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.ICandidateRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.CandidateRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IVoteRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.VoteRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IElectionParticipationRepository, StudentElectionSystem.Infrastructure.Persistence.Repositories.ElectionParticipationRepository>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Persistence.IUnitOfWork, StudentElectionSystem.Infrastructure.Persistence.UnitOfWork>();

        // Authentication Services
        services.AddScoped<IPasswordHasherService, PasswordHasherServiceImpl>();
        services.AddScoped<ITokenService, TokenServiceImpl>();

        services.AddHttpContextAccessor();

        // JWT Configuration
        var jwtSettings = new StudentElectionSystem.Infrastructure.Authentication.JwtSettings();
        configuration.GetSection(StudentElectionSystem.Infrastructure.Authentication.JwtSettings.SectionName).Bind(jwtSettings);
        services.Configure<StudentElectionSystem.Infrastructure.Authentication.JwtSettings>(configuration.GetSection(StudentElectionSystem.Infrastructure.Authentication.JwtSettings.SectionName));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(jwtSettings.Key)),
                ClockSkew = TimeSpan.Zero
            };

            options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
            {
                OnChallenge = async context =>
                {
                    context.HandleResponse();
                    if (!context.Response.HasStarted)
                    {
                        context.Response.StatusCode = Microsoft.AspNetCore.Http.StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        var response = StudentElectionSystem.Application.Common.Models.ApiResponse.Failure("Authentication is required.");
                        await Microsoft.AspNetCore.Http.HttpResponseWritingExtensions.WriteAsync(
                            context.Response, 
                            System.Text.Json.JsonSerializer.Serialize(response, new System.Text.Json.JsonSerializerOptions 
                            { 
                                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase 
                            }));
                    }
                },
                OnForbidden = async context =>
                {
                    if (!context.Response.HasStarted)
                    {
                        context.Response.StatusCode = Microsoft.AspNetCore.Http.StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        var response = StudentElectionSystem.Application.Common.Models.ApiResponse.Failure("You do not have permission to perform this action.");
                        await Microsoft.AspNetCore.Http.HttpResponseWritingExtensions.WriteAsync(
                            context.Response, 
                            System.Text.Json.JsonSerializer.Serialize(response, new System.Text.Json.JsonSerializerOptions 
                            { 
                                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase 
                            }));
                    }
                }
            };
        });

        return services;
    }
}
