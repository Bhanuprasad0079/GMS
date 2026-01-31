using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using GrievanceAPI.Services; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Ganss.Xss;

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        // Valid Categories Whitelist (Must match Frontend exactly)
        private readonly string[] _validCategories = 
        { 
            "Public Utilities", "Sanitation", "Roads & Transport", 
            "Law & Order", "Healthcare", "Other" 
        };

        public TicketController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // --- HELPER: Log History ---
        private async Task LogAction(int ticketId, string action, string description, string byUser)
        {
            var log = new TicketHistory
            {
                TicketId = ticketId,
                Action = action,
                Description = description,
                ChangedBy = byUser,
                Timestamp = DateTime.UtcNow
            };
            _context.TicketHistories.Add(log);
            // Note: We rely on the main method's SaveChangesAsync to commit this
        }

        // --- 1. CREATE TICKET ---
        [HttpPost("create")]
        public async Task<IActionResult> CreateTicket(CreateTicketDto request)
        {
            var userIdClaim = User.FindFirst("Id")?.Value;
            var userName = User.FindFirst("FullName")?.Value ?? "Citizen";
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            // 1. Sanitize Inputs (Prevent XSS)
            var sanitizer = new HtmlSanitizer();
            var cleanTitle = sanitizer.Sanitize(request.Title);
            var cleanDesc = sanitizer.Sanitize(request.Description);

            // 2. Validate Category
            string finalCategory = _validCategories.Contains(request.Category) ? request.Category : "Other";

            // 3. Auto-Assignment Logic
            var assignedWorker = await _context.Users
                .FirstOrDefaultAsync(u => u.Role == "Worker" && u.Department == finalCategory);

            var ticket = new Ticket
            {
                Title = cleanTitle,
                Category = finalCategory,
                Description = cleanDesc,
                CreatorId = int.Parse(userIdClaim),
                AssignedWorkerId = assignedWorker?.Id,
                Status = assignedWorker != null ? "ASSIGNED" : "OPEN", 
                Priority = "LOW",
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync(); // Save to generate Ticket ID

            // 4. Log Actions
            await LogAction(ticket.Id, "CREATED", "Ticket submitted by citizen.", $"Citizen ({userName})");
            
            if (assignedWorker != null)
            {
                await LogAction(ticket.Id, "AUTO-ASSIGN", $"System assigned to {assignedWorker.FullName}", "System");
            }
            await _context.SaveChangesAsync(); // Save Logs

            // 5. Email Notification
            if (!string.IsNullOrEmpty(userEmail))
            {
                try 
                {
                    string workerMsg = assignedWorker != null 
                        ? $"Good news! We have automatically assigned <strong>{assignedWorker.FullName}</strong> ({assignedWorker.Department}) to this issue." 
                        : "Your grievance is currently in the queue for the next available officer.";

                    string subject = $"✔ Grievance Received: #{ticket.Id}";
                    string body = $@"
                        <div style='font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                            <h2 style='color: #4f46e5;'>Grievance Submitted</h2>
                            <p>Ticket <strong>#{ticket.Id}</strong> has been logged.</p>
                            <p><strong>Category:</strong> {ticket.Category}</p>
                            <hr style='border: 0; border-top: 1px solid #eee;'/>
                            <p style='color: #059669; font-weight: bold;'>{workerMsg}</p>
                            <br/>
                            <a href='http://localhost:3000/dashboard' style='background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Track Status</a>
                        </div>";
                    
                    await _emailService.SendEmailAsync(userEmail, subject, body);
                }
                catch (Exception ex) { Console.WriteLine(ex.Message); }
            }

            return Ok(new { message = "Grievance submitted", ticketId = ticket.Id });
        }

        // --- 2. GET MY TICKETS (Citizen) ---
        [HttpGet("my-tickets/{userId}")]
        public async Task<IActionResult> GetMyTickets(int userId)
        {
            var tokenUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; 

            if (userId != tokenUserId && userRole != "Admin" && userRole != "SuperAdmin") return Forbid(); 

            var tickets = await _context.Tickets
                .Where(t => t.CreatorId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // --- 3. DELETE TICKET ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound(new { message = "Ticket not found" });

            var tokenUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; 

            bool isAdmin = userRole == "Admin" || userRole == "SuperAdmin";
            bool isOwner = ticket.CreatorId == tokenUserId;

            if (!isAdmin && !isOwner) return Forbid(); 

            // Allow delete only if OPEN, unless Admin
            if (!isAdmin && ticket.Status != "OPEN")
            {
                return BadRequest(new { message = "Cannot delete. This grievance is already being processed." });
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket deleted successfully" });
        }

        // --- 4. GET ALL TICKETS (Admin) ---
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("all-tickets")]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Creator)        
                .Include(t => t.AssignedWorker) 
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // --- 5. UPDATE TICKET ---
        [Authorize(Roles = "Admin,SuperAdmin,Worker,Citizen")] 
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto request)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Creator) 
                .Include(t => t.AssignedWorker)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound(new { message = "Ticket not found" });

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userName = User.FindFirst("FullName")?.Value ?? "Unknown";
            var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");

            // Security Check: Citizen Restrictions
            if (userRole == "Citizen")
            {
                if (ticket.CreatorId != userId) return Forbid();
                if (request.Status != "CLOSED" && request.Status != "RE-OPENED") return BadRequest("Citizens can only Close or Reopen.");
            }

            // Capture Old State
            string oldStatus = ticket.Status;
            string oldPriority = ticket.Priority;
            int? oldWorker = ticket.AssignedWorkerId;

            // Apply Updates
            if (!string.IsNullOrEmpty(request.Status)) ticket.Status = request.Status;
            if (!string.IsNullOrEmpty(request.Priority)) ticket.Priority = request.Priority;
            
            // Logic: Admin Re-assign
            if ((userRole == "Admin" || userRole == "SuperAdmin") && request.AssignedWorkerId.HasValue)
            {
                ticket.AssignedWorkerId = request.AssignedWorkerId == 0 ? null : request.AssignedWorkerId;
            }
            
            // Logic: Worker Escalate (Unassign Self)
            if (userRole == "Worker" && request.AssignedWorkerId == 0)
            {
                ticket.AssignedWorkerId = null;
                ticket.Status = "OPEN"; // Returns to pool
            }

            // --- AUDIT LOGGING ---
            string actor = $"{userRole} ({userName})";

            if (oldStatus != ticket.Status)
                await LogAction(id, "STATUS UPDATE", $"{oldStatus} ➜ {ticket.Status}", actor);

            if (oldPriority != ticket.Priority)
                await LogAction(id, "PRIORITY UPDATE", $"{oldPriority} ➜ {ticket.Priority}", actor);

            if (oldWorker != ticket.AssignedWorkerId)
            {
                string assignMsg = ticket.AssignedWorkerId == null ? "Unassigned (Sent to Pool)" : "Worker Changed";
                await LogAction(id, "ASSIGNMENT", assignMsg, actor);
            }

            await _context.SaveChangesAsync();

            // --- EMAIL NOTIFICATIONS ---
            // 1. Notify Worker if Citizen Re-opens
            if (oldStatus == "RESOLVED" && ticket.Status == "RE-OPENED" && ticket.AssignedWorker != null)
            {
                try {
                    await _emailService.SendEmailAsync(ticket.AssignedWorker.Email, 
                        $"ACTION REQUIRED: Ticket #{ticket.Id} Re-opened", 
                        $"<p>Citizen <strong>{ticket.Creator?.FullName}</strong> was not satisfied with the resolution. Ticket #{ticket.Id} is re-opened for review.</p>");
                } catch {}
            }
            // 2. Notify Citizen if Status Changes (Standard)
            else if (oldStatus != ticket.Status && ticket.Creator != null && userRole != "Citizen")
            {
                try {
                    string color = ticket.Status == "RESOLVED" ? "#10b981" : "#f59e0b";
                    await _emailService.SendEmailAsync(ticket.Creator.Email, 
                        $"Update: Ticket #{ticket.Id} is {ticket.Status}", 
                        $"<p>Status changed from {oldStatus} to <strong style='color:{color}'>{ticket.Status}</strong>.</p>");
                } catch {}
            }

            return Ok(new { message = "Ticket updated successfully" });
        }

        // --- 6. GET ASSIGNED TICKETS (Worker Inbox) ---
        [Authorize(Roles = "Worker,Admin,SuperAdmin")]
        [HttpGet("assigned-tickets/{workerId}")]
        public async Task<IActionResult> GetAssignedTickets(int workerId)
        {
            var tokenUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (workerId != tokenUserId && userRole != "Admin" && userRole != "SuperAdmin") return Forbid();

            var tickets = await _context.Tickets
                .Include(t => t.Creator) 
                .Where(t => t.AssignedWorkerId == workerId)
                .OrderByDescending(t => t.Priority == "HIGH")
                .ThenByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // --- 7. GET HISTORY (New Endpoint) ---
        [HttpGet("history/{ticketId}")]
        public async Task<IActionResult> GetHistory(int ticketId)
        {
            var logs = await _context.TicketHistories
                .Where(h => h.TicketId == ticketId)
                .OrderByDescending(h => h.Timestamp)
                .ToListAsync();
            return Ok(logs);
        }
    }
}