using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class ElectionParticipationConfiguration : IEntityTypeConfiguration<ElectionParticipation>
{
    public void Configure(EntityTypeBuilder<ElectionParticipation> builder)
    {
        builder.HasKey(ep => ep.Id);

        builder.Property(ep => ep.VotedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(ep => ep.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(ep => ep.UpdatedAt)
            .HasColumnType("datetime2");

        // Relationships
        builder.HasOne<Student>()
            .WithMany()
            .HasForeignKey(ep => ep.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Election>()
            .WithMany()
            .HasForeignKey(ep => ep.ElectionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        // Critical constraint: A student can only participate in an election once
        builder.HasIndex(ep => new { ep.StudentId, ep.ElectionId }).IsUnique();
    }
}
