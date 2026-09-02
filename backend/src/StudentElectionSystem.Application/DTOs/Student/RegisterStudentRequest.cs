using System.ComponentModel.DataAnnotations;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Student;

public class RegisterStudentRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one digit.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Department { get; set; } = string.Empty;

    [Range(1, 10, ErrorMessage = "Year of study must be a valid number.")]
    public int YearOfStudy { get; set; }

    [Required]
    [EnumDataType(typeof(Gender), ErrorMessage = "Invalid gender specified.")]
    public Gender Gender { get; set; }

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }
}
