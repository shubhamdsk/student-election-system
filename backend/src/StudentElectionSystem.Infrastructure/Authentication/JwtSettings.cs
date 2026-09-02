namespace StudentElectionSystem.Infrastructure.Authentication;

public class JwtSettings
{
    public const string SectionName = "Jwt";
    
    public string Issuer { get; init; } = null!;
    public string Audience { get; init; } = null!;
    public string Key { get; init; } = null!;
    public int AccessTokenExpirationMinutes { get; init; }
}
