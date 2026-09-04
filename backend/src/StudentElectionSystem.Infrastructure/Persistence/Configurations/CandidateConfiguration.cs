using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
{
    public void Configure(EntityTypeBuilder<Candidate> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Manifesto)
            .HasMaxLength(2000);

        builder.Property(c => c.NominatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(c => c.IsApproved)
            .IsRequired();

        builder.Property(c => c.ApprovedAt)
            .HasColumnType("datetime2");

        builder.Property(c => c.IsRejected)
            .IsRequired();

        builder.Property(c => c.RejectedAt)
            .HasColumnType("datetime2");

        builder.Property(c => c.RejectionReason)
            .HasMaxLength(1000);

        builder.Property(c => c.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(c => c.UpdatedAt)
            .HasColumnType("datetime2");

        // Relationships
        builder.HasOne(c => c.Student)
            .WithMany()
            .HasForeignKey(c => c.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Election)
            .WithMany(e => e.Candidates)
            .HasForeignKey(c => c.ElectionId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.ApprovedByAdminId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        // A student cannot be nominated twice for the same election
        builder.HasIndex(c => new { c.StudentId, c.ElectionId }).IsUnique();
    }
}
