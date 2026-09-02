namespace StudentElectionSystem.Domain.Enums;

/// <summary>
/// Represents the lifecycle stages of an <see cref="Entities.Election"/>.
///
/// <para>Allowed forward progression:</para>
/// <code>Draft → Nominations → Voting → Closed → ResultPublished</code>
/// <para>
/// Any state except <see cref="Closed"/> and <see cref="ResultPublished"/> may
/// transition directly to <see cref="Cancelled"/>.
/// </para>
/// </summary>
public enum ElectionStatus
{
    /// <summary>
    /// The election has been created but is not yet visible to students.
    /// Admins can configure all election parameters in this state.
    /// </summary>
    Draft = 0,

    /// <summary>
    /// The election is in the nomination window.
    /// Approved students may submit candidacy applications;
    /// Admins review and approve nominations.
    /// </summary>
    Nominations = 1,

    /// <summary>
    /// The nomination window has closed and voting is now open.
    /// Approved students may cast a single anonymous ballot.
    /// </summary>
    Voting = 2,

    /// <summary>
    /// Voting has ended. Ballots are tallied; results are not yet published.
    /// No further votes or nominations can be accepted.
    /// </summary>
    Closed = 3,

    /// <summary>
    /// Results have been officially published and are visible to all participants.
    /// This is the terminal success state; no further transitions are possible.
    /// </summary>
    ResultPublished = 4,

    /// <summary>
    /// The election was cancelled before reaching <see cref="ResultPublished"/>.
    /// All nominations and ballots are voided.
    /// </summary>
    Cancelled = 5
}
