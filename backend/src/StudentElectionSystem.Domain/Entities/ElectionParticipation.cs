using StudentElectionSystem.Domain.Common;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// An immutable record that proves a specific student cast a ballot in a specific election.
///
/// <para>
/// <strong>Creation:</strong> An <see cref="ElectionParticipation"/> record is created
/// only at the moment a student successfully casts their ballot — not pre-allocated
/// when an election opens. Its existence is the proof of participation.
/// </para>
///
/// <para>
/// <strong>Privacy design:</strong> This record identifies <em>who</em> participated
/// (via <see cref="StudentId"/>) and <em>when</em>, but contains no information about
/// <em>which candidate</em> was chosen. That information lives exclusively in the
/// anonymous <see cref="Vote"/> ballot record, which carries no voter identity.
/// Because there is no shared key between the two records a database query cannot
/// reconstruct the link from a specific student to a specific candidate.
/// </para>
///
/// <para>
/// <strong>One-vote invariant:</strong> The combination of
/// (<see cref="StudentId"/>, <see cref="ElectionId"/>) must be unique. This is enforced
/// at the database level by a unique constraint configured in the Infrastructure layer.
/// At the domain level, the Application layer must verify no participation record exists
/// for this student and election before creating one.
/// </para>
/// </summary>
public sealed class ElectionParticipation : BaseEntity
{
    // ── Keys ─────────────────────────────────────────────────────────────────

    /// <summary>The <see cref="Student.Id"/> of the student who cast a ballot.</summary>
    public Guid StudentId { get; }

    /// <summary>The <see cref="Election.Id"/> in which the ballot was cast.</summary>
    public Guid ElectionId { get; }

    // ── Participation Timestamp ───────────────────────────────────────────────

    /// <summary>UTC timestamp when the ballot was cast and this record was created.</summary>
    public DateTime VotedAt { get; }

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates an immutable participation record at the moment a student casts their ballot.
    /// </summary>
    /// <param name="studentId">The <see cref="Student.Id"/> of the voting student.</param>
    /// <param name="electionId">The <see cref="Election.Id"/> of the election.</param>
    public ElectionParticipation(Guid studentId, Guid electionId)
    {
        StudentId = studentId;
        ElectionId = electionId;
        VotedAt = DateTime.UtcNow;
    }
}
