using StudentElectionSystem.Domain.Common;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// Represents a <see cref="Student"/> nominated as a candidate for a specific <see cref="Election"/>.
///
/// Design note: A Candidate is NOT a separate authentication role or user type.
/// It is a contextual relationship: a Student becomes a Candidate only for
/// the duration and scope of a particular election. One Student may be a
/// Candidate in multiple elections simultaneously.
/// </summary>
public sealed class Candidate : BaseEntity
{
    // ── Keys ─────────────────────────────────────────────────────────────────

    /// <summary>The Id of the <see cref="Student"/> who submitted this nomination.</summary>
    public Guid StudentId { get; private set; }

    /// <summary>The Id of the <see cref="Election"/> this nomination belongs to.</summary>
    public Guid ElectionId { get; private set; }

    // ── Navigation Properties ────────────────────────────────────────────────

    /// <summary>Navigation to the student who submitted this nomination.</summary>
    public Student Student { get; private set; } = null!;

    /// <summary>Navigation to the election this nomination belongs to.</summary>
    public Election Election { get; private set; } = null!;

    // ── Nomination Details ────────────────────────────────────────────────────

    /// <summary>
    /// The student's campaign statement / manifesto presented to voters.
    /// Optional; can be updated before the voting window opens.
    /// </summary>
    public string? Manifesto { get; private set; }

    /// <summary>UTC timestamp when the student submitted the nomination.</summary>
    public DateTime NominatedAt { get; private set; }

    // ── Admin Review ─────────────────────────────────────────────────────────

    /// <summary>
    /// Indicates whether an Admin has approved this nomination.
    /// Unapproved candidates are not visible to voters.
    /// </summary>
    public bool IsApproved { get; private set; }

    /// <summary>
    /// The <see cref="User.Id"/> of the Admin (<see cref="UserRole.Admin"/>) who approved this nomination.
    /// Null until an Admin approves.
    /// </summary>
    public Guid? ApprovedByAdminId { get; private set; }

    /// <summary>UTC timestamp when the nomination was approved. Null until approved.</summary>
    public DateTime? ApprovedAt { get; private set; }

    /// <summary>
    /// Indicates whether an Admin has rejected this nomination.
    /// Rejected candidates are not eligible.
    /// </summary>
    public bool IsRejected { get; private set; }

    /// <summary>UTC timestamp when the nomination was rejected. Null until rejected.</summary>
    public DateTime? RejectedAt { get; private set; }

    /// <summary>
    /// The reason provided by the Admin for rejecting the nomination.
    /// </summary>
    public string? RejectionReason { get; private set; }

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a new pending candidate nomination.
    /// The nomination must be approved by an Admin before the student appears on the ballot.
    /// </summary>
    /// <param name="studentId">The Id of the nominating student.</param>
    /// <param name="electionId">The Id of the target election.</param>
    /// <param name="manifesto">Optional campaign statement.</param>
    public Candidate(Guid studentId, Guid electionId, string? manifesto = null)
    {
        StudentId = studentId;
        ElectionId = electionId;
        Manifesto = manifesto;
        NominatedAt = DateTime.UtcNow;
        IsApproved = false;
        IsRejected = false;
    }

    // ── Domain Behaviour ─────────────────────────────────────────────────────

    /// <summary>
    /// Approves this candidate nomination.
    /// Once approved, the candidate appears on the ballot when voting opens.
    /// </summary>
    /// <param name="adminId">The Id of the Admin approving the nomination.</param>
    /// <exception cref="InvalidOperationException">Thrown if the nomination is already approved.</exception>
    public void Approve(Guid adminId)
    {
        if (IsApproved)
            throw new InvalidOperationException("This candidate nomination is already approved.");
            
        if (IsRejected)
            throw new InvalidOperationException("This candidate nomination has been rejected.");

        IsApproved = true;
        ApprovedByAdminId = adminId;
        ApprovedAt = DateTime.UtcNow;
        MarkUpdated();
    }

    /// <summary>
    /// Rejects this candidate nomination.
    /// </summary>
    /// <param name="adminId">The Id of the Admin rejecting the nomination.</param>
    /// <param name="reason">The reason for rejection.</param>
    /// <exception cref="InvalidOperationException">Thrown if the nomination is already approved or rejected.</exception>
    public void Reject(Guid adminId, string reason)
    {
        if (IsApproved)
            throw new InvalidOperationException("This candidate nomination is already approved.");
            
        if (IsRejected)
            throw new InvalidOperationException("This candidate nomination is already rejected.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("A rejection reason must be provided.", nameof(reason));

        IsRejected = true;
        RejectedAt = DateTime.UtcNow;
        RejectionReason = reason;
        
        // Use ApprovedByAdminId to store the reviewer for now, 
        // or add RejectedByAdminId if needed. For simplicity, we just set the reviewer.
        ApprovedByAdminId = adminId; 
        
        MarkUpdated();
    }

    /// <summary>
    /// Updates the candidate's manifesto.
    /// Allowed only before the candidate is approved (Admin can still edit after approval
    /// if the application layer permits, but typically this is a student-only action pre-approval).
    /// </summary>
    public void UpdateManifesto(string? manifesto)
    {
        Manifesto = manifesto;
        MarkUpdated();
    }
}
