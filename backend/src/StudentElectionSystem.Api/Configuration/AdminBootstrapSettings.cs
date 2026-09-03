namespace StudentElectionSystem.Api.Configuration;

public class AdminBootstrapSettings
{
    public const string SectionName = "AdminBootstrap";

    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
