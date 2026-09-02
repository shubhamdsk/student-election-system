namespace StudentElectionSystem.Domain.Enums;

/// <summary>
/// Represents the approval lifecycle state of a Student registration request.
/// Students start as <see cref="Pending"/> and an Admin moves them to
/// <see cref="Approved"/> or <see cref="Rejected"/>.
/// </summary>
public enum ApprovalStatus
{
    /// <summary>
    /// The student has registered but an Admin has not yet reviewed the request.
    /// </summary>
    Pending = 0,

    /// <summary>
    /// The Admin has verified and approved the student. The student may now
    /// participate in elections (vote and be nominated as a candidate).
    /// </summary>
    Approved = 1,

    /// <summary>
    /// The Admin has rejected the registration. The student cannot participate
    /// unless they re-register or an Admin overrides the decision.
    /// </summary>
    Rejected = 2
}
