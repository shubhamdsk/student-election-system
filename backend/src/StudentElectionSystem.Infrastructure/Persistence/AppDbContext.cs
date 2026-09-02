using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Domain.Entities;
using System.Reflection;

namespace StudentElectionSystem.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Election> Elections => Set<Election>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
    public DbSet<Vote> Votes => Set<Vote>();
    public DbSet<ElectionParticipation> ElectionParticipations => Set<ElectionParticipation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Apply all configurations defined in the current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
