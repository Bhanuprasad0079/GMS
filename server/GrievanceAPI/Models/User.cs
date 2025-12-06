using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;
        
        // This will store either Email or Mobile from your frontend
        public string Contact { get; set; } = string.Empty; 
        
        public string PasswordHash { get; set; } = string.Empty;
        
        public string Address { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;

        // Default to "Citizen", can be "Admin" later
        public string Role { get; set; } = "Citizen"; 
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}