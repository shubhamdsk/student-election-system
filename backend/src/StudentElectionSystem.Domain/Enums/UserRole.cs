namespace StudentElectionSystem.Domain.Enums;

/// <summary>
/// Defines the authentication and authorization roles available within the system.
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Full administrative access: manages elections, approves students and candidates.
    /// </summary>
    Admin = 1,

    /// <summary>
    /// A registered student who can vote and be nominated as a candidate.
    /// </summary>
    Student = 2
}
