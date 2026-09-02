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

        IsApproved = true;
        ApprovedByAdminId = adminId;
        ApprovedAt = DateTime.UtcNow;
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
