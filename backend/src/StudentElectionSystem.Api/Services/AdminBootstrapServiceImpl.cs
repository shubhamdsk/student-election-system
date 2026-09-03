using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudentElectionSystem.Api.Configuration;
using StudentElectionSystem.Application.Interfaces.Authentication;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Api.Services;

public class AdminBootstrapServiceImpl : IAdminBootstrapService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasherService _passwordHasherService;
    private readonly AdminBootstrapSettings _settings;
    private readonly ILogger<AdminBootstrapServiceImpl> _logger;
    private readonly StudentElectionSystem.Infrastructure.Persistence.AppDbContext _dbContext;

    public AdminBootstrapServiceImpl(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasherService,
        IOptions<AdminBootstrapSettings> options,
        ILogger<AdminBootstrapServiceImpl> logger,
        StudentElectionSystem.Infrastructure.Persistence.AppDbContext dbContext)
    {
        _userRepository = userRepository;
        _passwordHasherService = passwordHasherService;
        _settings = options.Value;
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task EnsureAdminExistsAsync(CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Email) || string.IsNullOrWhiteSpace(_settings.Password))
        {
            _logger.LogWarning("Admin bootstrap settings are missing or incomplete. Skipping development admin setup.");
            return;
        }

        var adminExists = await _userRepository.AnyAdminExistsAsync(cancellationToken);
        if (adminExists)
        {
            _logger.LogInformation("Development Admin already exists.");
            return;
        }

        var normalizedEmail = _settings.Email.ToUpperInvariant();

        var existingUser = await _userRepository.GetByNormalizedEmailAsync(normalizedEmail, cancellationToken);
        if (existingUser != null)
        {
            var errorMessage = "The configured development Admin email is already assigned to a non-Admin account.";
            _logger.LogError(errorMessage);
            throw new InvalidOperationException(errorMessage);
        }


        var passwordHash = _passwordHasherService.HashPassword(_settings.Password);
        var adminUser = new User(_settings.Email, passwordHash, UserRole.Admin);

        await _userRepository.AddAsync(adminUser, cancellationToken);
        
        // IUserRepository explicitly says: "Note: SaveChangesAsync is called separately for atomicity across entities."
        // We inject AppDbContext to call SaveChangesAsync here.
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Development Admin account created.");
    }
}
