using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.UserId)
            .IsRequired();

        builder.Property(s => s.FullName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(s => s.RegistrationNumber)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(s => s.Department)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.YearOfStudy)
            .IsRequired();

        builder.Property(s => s.Gender)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(s => s.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(s => s.ApprovalStatus)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(s => s.ApprovedAt)
            .HasColumnType("datetime2");

        builder.Property(s => s.RejectedAt)
            .HasColumnType("datetime2");

        builder.Property(s => s.RejectionReason)
            .HasMaxLength(500);

        builder.Property(s => s.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(s => s.UpdatedAt)
            .HasColumnType("datetime2");

        // Relationships
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(s => s.UserId).IsUnique();
        builder.HasIndex(s => s.RegistrationNumber).IsUnique();
    }
}
