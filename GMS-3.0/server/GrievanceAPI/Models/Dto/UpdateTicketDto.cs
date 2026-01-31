namespace GrievanceAPI.Models.Dto
{
    public class UpdateTicketDto
    {
        public string Status { get; set; } = string.Empty; // OPEN, ASSIGNED, RESOLVED, CLOSED
        public string Priority { get; set; } = string.Empty; // LOW, MEDIUM, HIGH
        public int? AssignedWorkerId { get; set; } // The ID of the worker
    }
}