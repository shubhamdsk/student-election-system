namespace StudentElectionSystem.Domain.Common;

/// <summary>
/// Abstract base for all domain entities.
/// Provides a stable Guid identity and audit timestamps.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>Unique identifier for the entity.</summary>
    public Guid Id { get; protected set; } = Guid.NewGuid();

    /// <summary>UTC timestamp of when the entity was first persisted.</summary>
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;

    /// <summary>UTC timestamp of the most recent update. Null until first update.</summary>
    public DateTime? UpdatedAt { get; protected set; }

    /// <summary>
    /// Records that the entity has been modified.
    /// Called by domain methods that mutate state, not by setters directly.
    /// </summary>
    protected void MarkUpdated()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
