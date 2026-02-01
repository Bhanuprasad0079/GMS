using System.ComponentModel.DataAnnotations;

namespace GrievanceAPI.Models.Dto
{
    public class CreateTicketDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public int CreatorId { get; set; } // The ID of the user submitting the ticket
        public IFormFile? Image { get; set; }
    }
}