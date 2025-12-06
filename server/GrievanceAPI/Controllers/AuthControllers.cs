using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // --- REGISTRATION ENDPOINT ---
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            // 1. Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Contact == request.Contact))
            {
                return BadRequest(new { message = "User with this email/mobile already exists." });
            }

            // 2. Create the User Object
            var user = new User
            {
                FullName = request.FullName,
                Contact = request.Contact,
                // NOTE: In a real production app, you MUST hash this password (e.g. BCrypt)
                PasswordHash = request.Password, 
                Address = request.Address,
                State = request.State,
                District = request.District,
                Pincode = request.Pincode,
                Role = "Citizen",
                CreatedAt = DateTime.UtcNow
            };

            // 3. Save to Database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

        // --- LOGIN ENDPOINT ---
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request) 
        {
             // 1. Find user by Contact (Email or Mobile)
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Contact == request.Contact);

             // 2. Check if user exists AND password matches
             if (user == null || user.PasswordHash != request.Password)
             {
                 return Unauthorized(new { message = "Invalid credentials" });
             }

             // 3. Return Success with basic user info
             return Ok(new { 
                 message = "Login successful", 
                 userId = user.Id, 
                 fullName = user.FullName,
                 role = user.Role
             });
        }
    }
}