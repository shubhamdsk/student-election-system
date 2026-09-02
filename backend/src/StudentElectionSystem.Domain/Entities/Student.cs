using StudentElectionSystem.Domain.Common;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// Represents the academic profile and registration lifecycle of a student.
///
/// <para>
/// A <see cref="Student"/> is linked to its authentication account via <see cref="UserId"/>.
/// The <see cref="User"/> entity owns credentials and account-state only.
/// All student identity and profile information lives here.
/// </para>
///
/// <para>Approval lifecycle:</para>
/// <list type="number">
///   <item>Student self-registers → <see cref="ApprovalStatus.Pending"/></item>
///   <item>Admin reviews → <see cref="ApprovalStatus.Approved"/> or <see cref="ApprovalStatus.Rejected"/></item>
///   <item>Only <see cref="ApprovalStatus.Approved"/> students may vote or be nominated as candidates.</item>
/// </list>
/// </summary>
public sealed class Student : BaseEntity
{
    // ── Link to Auth Account ──────────────────────────────────────────────────

    /// <summary>
    /// The <see cref="User.Id"/> of the authentication account associated with this student profile.
    /// One-to-one: each student has exactly one <see cref="User"/> with <see cref="UserRole.Student"/>.
    /// </summary>
    public Guid UserId { get; private set; }

    // ── Student Identity &amp; Profile ──────────────────────────────────────────

    /// <summary>Student's full name.</summary>
    public string FullName { get; private set; }

    /// <summary>
    /// Institution-issued registration / roll number.
    /// Uniquely identifies a student independent of their email address.
    /// </summary>
    public string RegistrationNumber { get; private set; }

    /// <summary>Department or faculty the student belongs to (e.g., "Computer Science").</summary>
    public string Department { get; private set; }

    /// <summary>Current academic year (e.g., 1, 2, 3, 4).</summary>
    public int YearOfStudy { get; private set; }

    /// <summary>Student's self-reported gender identity.</summary>
    public Gender Gender { get; private set; }

    /// <summary>Optional contact phone number.</summary>
    public string? PhoneNumber { get; private set; }

    // ── Approval Lifecycle ────────────────────────────────────────────────────

    /// <summary>Current approval state of this student's registration.</summary>
    public ApprovalStatus ApprovalStatus { get; private set; }

    /// <summary>
    /// UTC timestamp when an Admin approved this registration.
    /// Null if the student is still Pending or was Rejected.
    /// </summary>
    public DateTime? ApprovedAt { get; private set; }

    /// <summary>
    /// UTC timestamp when an Admin rejected this registration.
    /// Null if the student is still Pending or was Approved.
    /// </summary>
    public DateTime? RejectedAt { get; private set; }

    /// <summary>
    /// The <see cref="User.Id"/> of the Admin who reviewed this registration.
    /// Null until an Admin takes action.
    /// </summary>
    public Guid? ReviewedByAdminId { get; private set; }

    /// <summary>
    /// Plain-text reason provided by the Admin when rejecting a registration.
    /// Null when the student is Pending or Approved.
    /// </summary>
    public string? RejectionReason { get; private set; }

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a new <see cref="Student"/> profile linked to an existing <see cref="User"/> account.
    /// The student starts with <see cref="ApprovalStatus.Pending"/> and cannot participate
    /// in elections until an Admin approves the registration.
    /// </summary>
    /// <param name="userId">The <see cref="User.Id"/> of the associated authentication account.</param>
    /// <param name="fullName">Student's full name.</param>
    /// <param name="registrationNumber">Institution-issued registration number (must be unique).</param>
    /// <param name="department">Department or faculty the student belongs to.</param>
    /// <param name="yearOfStudy">Current academic year (e.g., 1–4).</param>
    /// <param name="gender">Student's self-reported gender.</param>
    /// <param name="phoneNumber">Optional contact phone number.</param>
    public Student(
        Guid userId,
        string fullName,
        string registrationNumber,
        string department,
        int yearOfStudy,
        Gender gender,
        string? phoneNumber = null)
    {
        UserId = userId;
        FullName = fullName;
        RegistrationNumber = registrationNumber;
        Department = department;
        YearOfStudy = yearOfStudy;
        Gender = gender;
        PhoneNumber = phoneNumber;
        ApprovalStatus = ApprovalStatus.Pending;
    }

    // ── Domain Behaviour ─────────────────────────────────────────────────────

    /// <summary>
    /// Approves this student's registration, allowing them to participate in elections.
    /// </summary>
    /// <param name="adminId">The <see cref="User.Id"/> of the Admin performing the approval.</param>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the student is not in <see cref="ApprovalStatus.Pending"/> state.
    /// </exception>
    public void Approve(Guid adminId)
    {
        if (ApprovalStatus != ApprovalStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot approve a student with status '{ApprovalStatus}'. Only Pending registrations can be approved.");

        ApprovalStatus = ApprovalStatus.Approved;
        ApprovedAt = DateTime.UtcNow;
        ReviewedByAdminId = adminId;
        RejectionReason = null;
        MarkUpdated();
    }

    /// <summary>
    /// Rejects this student's registration.
    /// </summary>
    /// <param name="adminId">The <see cref="User.Id"/> of the Admin performing the rejection.</param>
    /// <param name="reason">Mandatory plain-text reason explaining why registration was rejected.</param>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the student is not in <see cref="ApprovalStatus.Pending"/> state.
    /// </exception>
    /// <exception cref="ArgumentException">Thrown when <paramref name="reason"/> is blank.</exception>
    public void Reject(Guid adminId, string reason)
    {
        if (ApprovalStatus != ApprovalStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot reject a student with status '{ApprovalStatus}'. Only Pending registrations can be rejected.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("A rejection reason must be provided.", nameof(reason));

        ApprovalStatus = ApprovalStatus.Rejected;
        RejectedAt = DateTime.UtcNow;
        ReviewedByAdminId = adminId;
        RejectionReason = reason;
        MarkUpdated();
    }

    /// <summary>
    /// Updates the student's mutable academic profile details.
    /// </summary>
    public void UpdateProfile(string department, int yearOfStudy, string? phoneNumber)
    {
        Department = department;
        YearOfStudy = yearOfStudy;
        PhoneNumber = phoneNumber;
        MarkUpdated();
    }

    /// <summary>
    /// Returns <c>true</c> if this student is eligible to participate in elections
    /// (vote or be nominated as a candidate).
    /// Account active-state is enforced at the authentication layer via the linked
    /// <see cref="User.IsActive"/> flag and is not checked here.
    /// </summary>
    public bool IsEligibleToParticipate() =>
        ApprovalStatus == ApprovalStatus.Approved;
}
