using StudentElectionSystem.Domain.Common;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// An anonymous, immutable ballot record representing one vote cast for a candidate.
///
/// <para>
/// <strong>Privacy design:</strong> A <see cref="Vote"/> contains no voter identity.
/// It cannot be used on its own to determine which student voted for which candidate.
/// Voter participation is tracked separately in <see cref="ElectionParticipation"/>,
/// which records only <em>whether</em> a student has voted — not <em>for whom</em>.
/// </para>
///
/// <para>
/// Immutability is enforced by design: all properties are set exclusively through
/// the constructor and have no public setters. A ballot, once cast, must never be
/// altered. Voiding is an infrastructure-level concern (e.g., bulk deletion when
/// an election is cancelled).
/// </para>
/// </summary>
public sealed class Vote : BaseEntity
{
    // ── Ballot Contents ───────────────────────────────────────────────────────

    /// <summary>
    /// The <see cref="Election.Id"/> in which this ballot was cast.
    /// Stored directly for efficient tally queries without joining through <see cref="Candidate"/>.
    /// </summary>
    public Guid ElectionId { get; }

    /// <summary>The <see cref="Candidate.Id"/> this ballot was cast for.</summary>
    public Guid CandidateId { get; }

    /// <summary>UTC timestamp when this ballot was cast.</summary>
    public DateTime CastAt { get; }

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates an anonymous, immutable ballot.
    /// </summary>
    /// <param name="electionId">The <see cref="Election.Id"/> of the election.</param>
    /// <param name="candidateId">The <see cref="Candidate.Id"/> the voter chose.</param>
    public Vote(Guid electionId, Guid candidateId)
    {
        ElectionId = electionId;
        CandidateId = candidateId;
        CastAt = DateTime.UtcNow;
    }
}
