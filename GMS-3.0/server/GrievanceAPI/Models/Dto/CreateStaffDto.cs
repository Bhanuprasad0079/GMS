using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models.Dto
{
    public class CreateStaffDto : UserRegisterDto
    {
        [Required]
        public string Role { get; set; } = string.Empty; 
        
        // --- NEW ---
        public string Department { get; set; } = string.Empty;
    }
}