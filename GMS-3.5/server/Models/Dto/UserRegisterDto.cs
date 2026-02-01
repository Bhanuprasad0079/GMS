using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models.Dto
{
    public class UserRegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress] // <--- Enforces Email Format
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty; 
        public string Address { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
    }
}