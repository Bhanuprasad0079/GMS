using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models.Dto
{
    public class UserLoginDto
    {
        [Required]
        public string Contact { get; set; } = string.Empty; // Mobile or Email

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}