using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> AnyAdminExistsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .AnyAsync(u => u.Role == UserRole.Admin, cancellationToken);
    }

    public async Task<bool> ExistsByNormalizedEmailAsync(string normalizedEmail, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .AnyAsync(u => u.NormalizedEmail == normalizedEmail, cancellationToken);
    }

    public async Task<User?> GetByNormalizedEmailAsync(string normalizedEmail, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .SingleOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        // Note: SaveChangesAsync is called separately for atomicity across entities.
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }
}
