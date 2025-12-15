using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Create a Ticket (Citizen/Employee Dashboard)
        [HttpPost("create")]
        public async Task<IActionResult> CreateTicket(CreateTicketDto request)
        {
            var ticket = new Ticket
            {
                Title = request.Title,
                Category = request.Category,
                Description = request.Description,
                CreatorId = request.CreatorId,
                Status = "OPEN",
                Priority = "LOW",
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Grievance submitted successfully", ticketId = ticket.Id });
        }

        // 2. Get My Tickets (Citizen Dashboard)
        [HttpGet("my-tickets/{userId}")]
        public async Task<IActionResult> GetMyTickets(int userId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.CreatorId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // 3. Get All Tickets (Admin Dashboard)
        [HttpGet("all-tickets")]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Creator) // Include Creator details
                .Include(t => t.AssignedWorker) // Include Worker details
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }
    }
}