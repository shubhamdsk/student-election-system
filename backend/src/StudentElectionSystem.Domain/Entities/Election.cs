using StudentElectionSystem.Domain.Common;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Domain.Entities;

/// <summary>
/// Aggregate root for a student election event.
///
/// <para>Lifecycle (forward transitions only):</para>
/// <code>Draft → Nominations → Voting → Closed → ResultPublished</code>
/// <para>
/// Any state except <see cref="ElectionStatus.Closed"/> and
/// <see cref="ElectionStatus.ResultPublished"/> may be cancelled.
/// </para>
///
/// <para>
/// All mutations to an election's state go through this class's domain methods.
/// Child collections (<see cref="Candidates"/>, <see cref="Votes"/>) are exposed
/// as read-only; additions are performed via domain methods that enforce invariants.
/// </para>
///
/// <para>
/// <strong>Vote privacy:</strong> The <see cref="Votes"/> collection holds anonymous
/// ballot records only (<see cref="Vote"/>). Voter identity and participation state
/// are tracked in <see cref="ElectionParticipation"/>, which is managed separately
/// by the Application layer to keep the ballot secret.
/// </para>
/// </summary>
public sealed class Election : BaseEntity
{
    // ── Backing collections ───────────────────────────────────────────────────

    private readonly List<Candidate> _candidates = [];
    private readonly List<Vote> _votes = [];

    // ── Core Properties ───────────────────────────────────────────────────────

    /// <summary>Short, human-readable title of the election (e.g., "2025 Student Council Election").</summary>
    public string Title { get; private set; }

    /// <summary>Optional longer description / instructions visible to students.</summary>
    public string? Description { get; private set; }

    // ── Schedule ──────────────────────────────────────────────────────────────

    /// <summary>UTC start of the nomination window.</summary>
    public DateTime NominationStartAt { get; private set; }

    /// <summary>UTC end of the nomination window (must be after <see cref="NominationStartAt"/>).</summary>
    public DateTime NominationEndAt { get; private set; }

    /// <summary>UTC start of the voting window (must be on or after <see cref="NominationEndAt"/>).</summary>
    public DateTime VotingStartAt { get; private set; }

    /// <summary>UTC end of the voting window (must be after <see cref="VotingStartAt"/>).</summary>
    public DateTime VotingEndAt { get; private set; }

    // ── Configuration ─────────────────────────────────────────────────────────

    /// <summary>
    /// Maximum number of approved candidates allowed on the ballot.
    /// A value of <c>null</c> means no cap.
    /// </summary>
    public int? MaxCandidates { get; private set; }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    /// <summary>Current lifecycle stage of the election.</summary>
    public ElectionStatus Status { get; private set; }

    /// <summary>The <see cref="User.Id"/> of the Admin who created this election.</summary>
    public Guid CreatedByAdminId { get; private set; }

    // ── Navigation (read-only projections) ────────────────────────────────────

    /// <summary>All candidate nominations submitted for this election.</summary>
    public IReadOnlyCollection<Candidate> Candidates => _candidates.AsReadOnly();

    /// <summary>
    /// Anonymous ballot records cast in this election.
    /// Contains no voter identity; use <see cref="ElectionParticipation"/> to check
    /// whether a specific student has voted.
    /// </summary>
    public IReadOnlyCollection<Vote> Votes => _votes.AsReadOnly();

    // ── Constructor ───────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a new <see cref="Election"/> in <see cref="ElectionStatus.Draft"/> status.
    /// </summary>
    /// <exception cref="ArgumentException">Thrown when window dates are inconsistent.</exception>
    public Election(
        string title,
        string? description,
        DateTime nominationStartAt,
        DateTime nominationEndAt,
        DateTime votingStartAt,
        DateTime votingEndAt,
        Guid createdByAdminId,
        int? maxCandidates = null)
    {
        ValidateSchedule(nominationStartAt, nominationEndAt, votingStartAt, votingEndAt);

        Title = title;
        Description = description;
        NominationStartAt = nominationStartAt;
        NominationEndAt = nominationEndAt;
        VotingStartAt = votingStartAt;
        VotingEndAt = votingEndAt;
        CreatedByAdminId = createdByAdminId;
        MaxCandidates = maxCandidates;
        Status = ElectionStatus.Draft;
    }

    // ── Lifecycle Transitions ─────────────────────────────────────────────────

    /// <summary>
    /// Transitions <see cref="ElectionStatus.Draft"/> →
    /// <see cref="ElectionStatus.Nominations"/>, opening the nomination window.
    /// </summary>
    public void OpenNominations()
    {
        EnsureStatus(ElectionStatus.Draft, "open nominations");
        Status = ElectionStatus.Nominations;
        MarkUpdated();
    }

    /// <summary>
    /// Transitions <see cref="ElectionStatus.Nominations"/> →
    /// <see cref="ElectionStatus.Voting"/>, closing nominations and opening voting.
    /// </summary>
    public void OpenVoting()
    {
        EnsureStatus(ElectionStatus.Nominations, "open voting");
        Status = ElectionStatus.Voting;
        MarkUpdated();
    }

    /// <summary>
    /// Transitions <see cref="ElectionStatus.Voting"/> →
    /// <see cref="ElectionStatus.Closed"/>, ending the voting window.
    /// Votes are tallied but results are not yet published.
    /// </summary>
    public void CloseVoting()
    {
        EnsureStatus(ElectionStatus.Voting, "close voting");
        Status = ElectionStatus.Closed;
        MarkUpdated();
    }

    /// <summary>
    /// Transitions <see cref="ElectionStatus.Closed"/> →
    /// <see cref="ElectionStatus.ResultPublished"/>, making results visible to participants.
    /// This is the terminal success state; no further transitions are possible.
    /// </summary>
    public void PublishResults()
    {
        EnsureStatus(ElectionStatus.Closed, "publish results");
        Status = ElectionStatus.ResultPublished;
        MarkUpdated();
    }

    /// <summary>
    /// Cancels the election from any state except <see cref="ElectionStatus.Closed"/>
    /// and <see cref="ElectionStatus.ResultPublished"/>.
    /// Voiding of ballots and nominations is performed by the Application layer.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the election is in a terminal state (<see cref="ElectionStatus.Closed"/>,
    /// <see cref="ElectionStatus.ResultPublished"/>, or already <see cref="ElectionStatus.Cancelled"/>).
    /// </exception>
    public void Cancel()
    {
        if (Status is ElectionStatus.Closed or ElectionStatus.ResultPublished or ElectionStatus.Cancelled)
            throw new InvalidOperationException(
                $"Cannot cancel an election with status '{Status}'.");

        Status = ElectionStatus.Cancelled;
        MarkUpdated();
    }

    // ── Aggregate Mutations ───────────────────────────────────────────────────

    /// <summary>
    /// Adds an approved or pending candidate nomination to this election.
    /// Only allowed during the <see cref="ElectionStatus.Nominations"/> phase.
    /// </summary>
    /// <param name="candidate">The candidate nomination to add.</param>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the election is not in Nominations phase, or the student
    /// is already nominated in this election.
    /// </exception>
    public void AddCandidate(Candidate candidate)
    {
        EnsureStatus(ElectionStatus.Nominations, "add a candidate");

        if (_candidates.Any(c => c.StudentId == candidate.StudentId))
            throw new InvalidOperationException(
                "This student is already nominated as a candidate for this election.");

        _candidates.Add(candidate);
        MarkUpdated();
    }

    /// <summary>
    /// Records an anonymous ballot in this election.
    /// Only allowed during the <see cref="ElectionStatus.Voting"/> phase.
    ///
    /// <para>
    /// The one-vote-per-student invariant is <strong>not</strong> enforced here because
    /// <see cref="Vote"/> carries no voter identity. It is enforced by the caller
    /// (Application layer) via <see cref="ElectionParticipation.MarkVoted"/> before
    /// calling this method.
    /// </para>
    /// </summary>
    /// <param name="vote">The anonymous ballot to record.</param>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the election is not in the Voting phase.
    /// </exception>
    public void RecordVote(Vote vote)
    {
        EnsureStatus(ElectionStatus.Voting, "cast a vote");
        _votes.Add(vote);
        MarkUpdated();
    }

    // ── Configuration Updates (Draft only) ───────────────────────────────────

    /// <summary>
    /// Updates the election's title, description, and candidate cap.
    /// Only permitted while the election is in <see cref="ElectionStatus.Draft"/>.
    /// </summary>
    public void UpdateDetails(string title, string? description, int? maxCandidates)
    {
        EnsureStatus(ElectionStatus.Draft, "update election details");
        Title = title;
        Description = description;
        MaxCandidates = maxCandidates;
        MarkUpdated();
    }

    /// <summary>
    /// Updates the schedule windows.
    /// Only permitted while the election is in <see cref="ElectionStatus.Draft"/>.
    /// </summary>
    public void UpdateSchedule(
        DateTime nominationStartAt,
        DateTime nominationEndAt,
        DateTime votingStartAt,
        DateTime votingEndAt)
    {
        EnsureStatus(ElectionStatus.Draft, "update the schedule");
        ValidateSchedule(nominationStartAt, nominationEndAt, votingStartAt, votingEndAt);
        NominationStartAt = nominationStartAt;
        NominationEndAt = nominationEndAt;
        VotingStartAt = votingStartAt;
        VotingEndAt = votingEndAt;
        MarkUpdated();
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private void EnsureStatus(ElectionStatus required, string action)
    {
        if (Status != required)
            throw new InvalidOperationException(
                $"Cannot {action} on an election with status '{Status}'. Expected '{required}'.");
    }

    private static void ValidateSchedule(
        DateTime nominationStart,
        DateTime nominationEnd,
        DateTime votingStart,
        DateTime votingEnd)
    {
        if (nominationEnd <= nominationStart)
            throw new ArgumentException(
                "Nomination end date must be after nomination start date.");

        if (votingStart < nominationEnd)
            throw new ArgumentException(
                "Voting start date must not be before the nomination end date.");

        if (votingEnd <= votingStart)
            throw new ArgumentException(
                "Voting end date must be after voting start date.");
    }
}
