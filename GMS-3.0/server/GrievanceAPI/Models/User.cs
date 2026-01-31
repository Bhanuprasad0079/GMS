// using System.ComponentModel.DataAnnotations;

// namespace GrievanceAPI.Models
// {
//     public class User
//     {
//         [Key]
//         public int Id { get; set; }

//         public string FullName { get; set; } = string.Empty;
//         public string Email { get; set; } = string.Empty; 
//         public string PasswordHash { get; set; } = string.Empty;
        
//         // --- New Fields ---
//         public string Gender { get; set; } = string.Empty; // Gender
        
//         public string Address { get; set; } = string.Empty; // Location
//         public string State { get; set; } = string.Empty;
//         public string District { get; set; } = string.Empty;
//         public string Pincode { get; set; } = string.Empty;

//         // Roles: "Citizen", "Admin" (Parent), "Admin_Child", "Worker"
//         public string Role { get; set; } = "Citizen"; 
        
//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
//     }
// }

using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty; 
        public string PasswordHash { get; set; } = string.Empty;
        
        public string Gender { get; set; } = string.Empty; 
        public string Address { get; set; } = string.Empty; 
        public string State { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;

        public string Role { get; set; } = "Citizen"; 
        
        // --- NEW: Worker Specialization ---
        public string Department { get; set; } = string.Empty; // e.g., "Sanitation"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}