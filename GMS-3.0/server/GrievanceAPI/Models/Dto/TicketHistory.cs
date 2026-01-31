using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models
{
    public class TicketHistory
    {
        [Key]
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string Action { get; set; } = string.Empty; // e.g., "Status Change"
        public string Description { get; set; } = string.Empty; // e.g., "Changed from OPEN to RESOLVED"
        public string ChangedBy { get; set; } = string.Empty; // e.g., "Admin (John Doe)"
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}