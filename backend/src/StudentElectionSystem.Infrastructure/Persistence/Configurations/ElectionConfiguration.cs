using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class ElectionConfiguration : IEntityTypeConfiguration<Election>
{
    public void Configure(EntityTypeBuilder<Election> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(2000);

        builder.Property(e => e.NominationStartAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(e => e.NominationEndAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(e => e.VotingStartAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(e => e.VotingEndAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(e => e.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .HasColumnType("datetime2");

        // Relationships
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CreatedByAdminId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // EF Core can map read-only fields that represent backing fields
        // We configure the navigations that Election owns.
        
        builder.HasMany(e => e.Candidates)
            .WithOne()
            .HasForeignKey(c => c.ElectionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.Votes)
            .WithOne()
            .HasForeignKey(v => v.ElectionId)
            .OnDelete(DeleteBehavior.Restrict);
            
        var candidatesNavigation = builder.Metadata.FindNavigation(nameof(Election.Candidates));
        candidatesNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);

        var votesNavigation = builder.Metadata.FindNavigation(nameof(Election.Votes));
        votesNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
