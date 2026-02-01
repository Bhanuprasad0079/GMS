using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models.Dto
{
    public class OtpRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class OtpVerifyDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Otp { get; set; } = string.Empty;
    }
}