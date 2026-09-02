using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

        // Authentication Services
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Authentication.IPasswordHasher, StudentElectionSystem.Infrastructure.Authentication.BCryptPasswordHasher>();
        services.AddScoped<StudentElectionSystem.Application.Interfaces.Authentication.ITokenService, StudentElectionSystem.Infrastructure.Authentication.JwtTokenService>();

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
        });

        return services;
    }
}
