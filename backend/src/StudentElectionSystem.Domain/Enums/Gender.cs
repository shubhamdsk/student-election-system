namespace StudentElectionSystem.Domain.Enums;

/// <summary>
/// Gender identity options for a student profile.
/// Values are intentionally inclusive and non-exhaustive at the enum level;
/// additional options can be added without breaking existing persisted values.
/// </summary>
public enum Gender
{
    Male = 1,
    Female = 2,
    Other = 3,
    PreferNotToSay = 4
}
