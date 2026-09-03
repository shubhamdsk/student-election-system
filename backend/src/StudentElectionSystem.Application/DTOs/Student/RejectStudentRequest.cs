using System.ComponentModel.DataAnnotations;

namespace StudentElectionSystem.Application.DTOs.Student;

public class RejectStudentRequest
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}
