using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GrievanceAPI.Models;

namespace GrievanceAPI.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty; // e.g., "Sanitation"
        
        public string Description { get; set; } = string.Empty;

        // Workflow Status: OPEN, ASSIGNED, RESOLVED, CLOSED, RE-OPENED
        public string Status { get; set; } = "OPEN"; 
        
        // Priority: LOW, MEDIUM, HIGH (Set by Admin)
        public string Priority { get; set; } = "LOW";

        // Logic for Re-opening
        public string? ReopenReason { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }

        // --- Relationships ---

        // The User who created it
        public int CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public User? Creator { get; set; }

        // The Worker working on it
        public int? AssignedWorkerId { get; set; }
        [ForeignKey("AssignedWorkerId")]
        public User? AssignedWorker { get; set; }
    }
}