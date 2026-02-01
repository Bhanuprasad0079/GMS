using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using GrievanceAPI.Services; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Ganss.Xss;
using Microsoft.AspNetCore.RateLimiting; // Rate Limiting
using Microsoft.AspNetCore.Antiforgery;  // CSRF Protection

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ImageSecurityService _imageService;
        private readonly IAntiforgery _antiforgery; // Inject CSRF Service

        // Valid Categories Whitelist
        private readonly string[] _validCategories = 
        { 
            "Public Utilities", "Sanitation", "Roads & Transport", 
            "Law & Order", "Healthcare", "Other" 
        };

        public TicketController(AppDbContext context, IEmailService emailService, ImageSecurityService imageService, IAntiforgery antiforgery)
        {
            _context = context;
            _emailService = emailService;
            _imageService = imageService;
            _antiforgery = antiforgery;
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
        }

        // --- 1. CREATE TICKET (Secure Upload + CSRF + Rate Limit) ---
        [HttpPost("create")]
        [EnableRateLimiting("UploadPolicy")] // Limit: 5 uploads/min
        [ValidateAntiForgeryToken]           // Block CSRF attacks
        public async Task<IActionResult> CreateTicket([FromForm] CreateTicketDto request)
        {
            var userIdClaim = User.FindFirst("Id")?.Value;
            var userName = User.FindFirst("FullName")?.Value ?? "Citizen";
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            // 1. Sanitize Inputs (XSS Prevention)
            var sanitizer = new HtmlSanitizer();
            var cleanTitle = sanitizer.Sanitize(request.Title);
            var cleanDesc = sanitizer.Sanitize(request.Description);
            string finalCategory = _validCategories.Contains(request.Category) ? request.Category : "Other";

            // 2. Secure Image Processing
            string? savedFileName = null;
            if (request.Image != null && request.Image.Length > 0)
            {
                try 
                {
                    // Runs Magic Number check, Size check, and Re-encoding
                    savedFileName = await _imageService.SaveSecureImageAsync(request.Image);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"Image rejected: {ex.Message}" });
                }
            }

            // 3. Auto-Assign Logic
            var assignedWorker = await _context.Users
                .FirstOrDefaultAsync(u => u.Role == "Worker" && u.Department == finalCategory);

            var ticket = new Ticket
            {
                Title = cleanTitle,
                Category = finalCategory,
                Description = cleanDesc,
                AttachmentUrl = savedFileName, // Store secure filename only
                CreatorId = int.Parse(userIdClaim),
                AssignedWorkerId = assignedWorker?.Id,
                Status = assignedWorker != null ? "ASSIGNED" : "OPEN", 
                Priority = "LOW",
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync(); 

            // 4. Audit Logging
            await LogAction(ticket.Id, "CREATED", "Ticket submitted by citizen.", $"Citizen ({userName})");
            
            if (assignedWorker != null)
            {
                await LogAction(ticket.Id, "AUTO-ASSIGN", $"System assigned to {assignedWorker.FullName}", "System");
            }
            await _context.SaveChangesAsync();

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

        // --- 2. SECURE IMAGE RETRIEVAL ---
        [HttpGet("{ticketId}/attachment")]
        [Authorize]
        public async Task<IActionResult> GetTicketAttachment(int ticketId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null || string.IsNullOrEmpty(ticket.AttachmentUrl)) return NotFound("No attachment found.");

            // Authorization Check: Only Owner, Assigned Worker, or Admin
            var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            bool isAuthorized = false;
            if (userRole == "Admin" || userRole == "SuperAdmin") isAuthorized = true;
            else if (userRole == "Worker" && ticket.AssignedWorkerId == userId) isAuthorized = true;
            else if (userRole == "Citizen" && ticket.CreatorId == userId) isAuthorized = true;

            if (!isAuthorized) return Forbid();

            try 
            {
                var fileStream = _imageService.GetImageStream(ticket.AttachmentUrl);
                var contentType = _imageService.GetContentType(ticket.AttachmentUrl);
                return File(fileStream, contentType);
            }
            catch (FileNotFoundException)
            {
                return NotFound("File missing from server storage.");
            }
        }

        // --- 3. GET MY TICKETS ---
        [HttpGet("my-tickets/{userId}")]
        public async Task<IActionResult> GetMyTickets(int userId)
        {
            var tokenUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; 

            // Strict Owner Check
            if (userId != tokenUserId && userRole != "Admin" && userRole != "SuperAdmin") return Forbid(); 

            var tickets = await _context.Tickets
                .Where(t => t.CreatorId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // --- 4. DELETE TICKET (CSRF Protected) ---
        [HttpDelete("{id}")]
        [ValidateAntiForgeryToken] // Block CSRF
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound(new { message = "Ticket not found" });

            var tokenUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; 

            bool isAdmin = userRole == "Admin" || userRole == "SuperAdmin";
            bool isOwner = ticket.CreatorId == tokenUserId;

            if (!isAdmin && !isOwner) return Forbid(); 

            if (!isAdmin && ticket.Status != "OPEN")
            {
                return BadRequest(new { message = "Cannot delete. This grievance is already being processed." });
            }

            // Note: We keep the image file for audit purposes even if ticket is deleted from UI view, 
            // or implement a soft-delete mechanism. Here we physically delete the record.
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket deleted successfully" });
        }

        // --- 5. GET ALL TICKETS (Admin Only) ---
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

        // --- 6. UPDATE TICKET (CSRF Protected) ---
        [Authorize(Roles = "Admin,SuperAdmin,Worker,Citizen")] 
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken] // Block CSRF
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

            // Role-Specific Restrictions
            if (userRole == "Citizen")
            {
                if (ticket.CreatorId != userId) return Forbid();
                if (request.Status != "CLOSED" && request.Status != "RE-OPENED") return BadRequest("Citizens can only Close or Reopen.");
            }

            string oldStatus = ticket.Status;
            string oldPriority = ticket.Priority;
            int? oldWorker = ticket.AssignedWorkerId;

            // Apply Changes
            if (!string.IsNullOrEmpty(request.Status)) ticket.Status = request.Status;
            if (!string.IsNullOrEmpty(request.Priority)) ticket.Priority = request.Priority;
            
            if ((userRole == "Admin" || userRole == "SuperAdmin") && request.AssignedWorkerId.HasValue)
            {
                ticket.AssignedWorkerId = request.AssignedWorkerId == 0 ? null : request.AssignedWorkerId;
            }
            if (userRole == "Worker" && request.AssignedWorkerId == 0)
            {
                ticket.AssignedWorkerId = null;
                ticket.Status = "OPEN";
            }

            // Audit Logging
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

            // Email Notifications
            if (oldStatus == "RESOLVED" && ticket.Status == "RE-OPENED" && ticket.AssignedWorker != null)
            {
                try {
                    await _emailService.SendEmailAsync(ticket.AssignedWorker.Email, "Ticket Re-opened", "A citizen has re-opened a ticket assigned to you.");
                } catch {}
            }
            else if (oldStatus != ticket.Status && ticket.Creator != null && userRole != "Citizen")
            {
                try {
                    await _emailService.SendEmailAsync(ticket.Creator.Email, $"Update: Ticket #{ticket.Id}", $"Status changed to {ticket.Status}.");
                } catch {}
            }

            return Ok(new { message = "Ticket updated successfully" });
        }

        // --- 7. GET ASSIGNED TICKETS (Worker Only) ---
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

        // --- 8. GET HISTORY ---
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
