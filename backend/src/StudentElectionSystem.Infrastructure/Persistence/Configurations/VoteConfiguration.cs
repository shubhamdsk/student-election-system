using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class VoteConfiguration : IEntityTypeConfiguration<Vote>
{
    public void Configure(EntityTypeBuilder<Vote> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.CastAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(v => v.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(v => v.UpdatedAt)
            .HasColumnType("datetime2");

        // Relationships
        
        // Vote belongs to Candidate (but Candidate does not own Votes collection in domain to keep it simple)
        builder.HasOne<Candidate>()
            .WithMany()
            .HasForeignKey(v => v.CandidateId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Note: Vote's relationship to Election is configured from the Election side in ElectionConfiguration
        // to populate the Election.Votes collection correctly, but we can also specify the FK here if needed.
        // It's already handled, but we can be explicit about the FK index behavior:
        
        // Ensure no student/user identity ever enters this configuration
        // (verified by absence of StudentId or UserId in Vote entity)
    }
}
