using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(notification => notification.Id);
        builder.Property(notification => notification.Type).HasConversion<int>().IsRequired();
        builder.Property(notification => notification.Title).HasMaxLength(150).IsRequired();
        builder.Property(notification => notification.Message).HasMaxLength(500).IsRequired();
        builder.Property(notification => notification.RelatedEntityType).HasConversion<int?>();
        builder.Property(notification => notification.CreatedAt).HasColumnType("datetime2").IsRequired();
        builder.Property(notification => notification.UpdatedAt).HasColumnType("datetime2");
        builder.Property(notification => notification.ReadAt).HasColumnType("datetime2");
        builder.HasOne(notification => notification.User).WithMany().HasForeignKey(notification => notification.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(notification => new { notification.UserId, notification.IsRead, notification.CreatedAt });
        builder.HasIndex(notification => new { notification.UserId, notification.CreatedAt });
    }
}
