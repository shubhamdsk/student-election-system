using StudentElectionSystem.Domain.Common;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// Represents an authenticated system account.
/// Owns authentication and account-state concerns only:
/// credentials, role, active flag, and login audit.
///
/// <para>
/// Display name and all profile data belong to the associated <see cref="Student"/>
/// profile (linked via <see cref="Student.UserId"/>), not here.
/// A <see cref="User"/> with <see cref="UserRole.Admin"/> has no Student profile.
/// </para>
/// </summary>
public sealed class User : BaseEntity
{
    // ── Credentials ───────────────────────────────────────────────────────────

    /// <summary>Unique email address used for authentication.</summary>
    public string Email { get; private set; }

    /// <summary>
    /// Email stored in upper-case invariant form for case-insensitive uniqueness checks.
    /// Derived automatically from <see cref="Email"/> on construction or update.
    /// </summary>
    public string NormalizedEmail { get; private set; }

    /// <summary>
    /// Cryptographically hashed password. Plain-text is never stored here.
    /// The Application layer is responsible for hashing before passing to the domain.
    /// </summary>
    public string PasswordHash { get; private set; }

    // ── Role &amp; Account State ────────────────────────────────────────────────

    /// <summary>The system role assigned to this account.</summary>
    public UserRole Role { get; private set; }

    /// <summary>
    /// Indicates whether this account is active.
    /// Inactive accounts cannot authenticate or perform any operations.
    /// </summary>
    public bool IsActive { get; private set; }

    /// <summary>
    /// UTC timestamp of the most recent successful login.
    /// Null if the user has never logged in.
    /// </summary>
    public DateTime? LastLoginAt { get; private set; }

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a new <see cref="User"/> account.
    /// </summary>
    /// <param name="email">Unique email address (normalized internally).</param>
    /// <param name="passwordHash">Pre-hashed password supplied by the Application layer.</param>
    /// <param name="role">System role for authorization.</param>
    public User(string email, string passwordHash, UserRole role)
    {
        Email = email;
        NormalizedEmail = email.ToUpperInvariant();
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;
    }

    // ── Domain Behaviour ─────────────────────────────────────────────────────

    /// <summary>
    /// Replaces the stored password hash.
    /// The caller (Application layer) is responsible for hashing the new password first.
    /// </summary>
    public void UpdatePasswordHash(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        MarkUpdated();
    }

    /// <summary>Deactivates the account. The user can no longer log in.</summary>
    public void Deactivate()
    {
        IsActive = false;
        MarkUpdated();
    }

    /// <summary>Reactivates a previously deactivated account.</summary>
    public void Activate()
    {
        IsActive = true;
        MarkUpdated();
    }

    /// <summary>Records a successful login event with the current UTC time.</summary>
    public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        MarkUpdated();
    }
}
