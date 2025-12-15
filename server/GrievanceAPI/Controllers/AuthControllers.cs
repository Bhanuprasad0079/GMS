using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using GrievanceAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        // Constructor Injection
        public AuthController(AppDbContext context, IMemoryCache cache, IEmailService emailService)
        {
            _context = context;
            _cache = cache;
            _emailService = emailService;
        }

        // ==========================================
        // 1. OTP SYSTEM
        // ==========================================

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] OtpRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Contact))
            {
                return BadRequest(new { message = "Contact details are required." });
            }

            // Generate 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Store in Cache for 5 minutes
            _cache.Set(request.Contact, otp, TimeSpan.FromMinutes(5));

            try 
            {
                // Try sending real email
                // Note: Configure EmailSettings in appsettings.json for this to work perfectly
                await _emailService.SendEmailAsync(request.Contact, "Grievance Portal Verification", $"Your OTP is: {otp}");
                return Ok(new { message = "OTP sent successfully via Email." });
            }
            catch(Exception)
            {
                // FALLBACK FOR DEV: Return OTP in response so you can test without a real email server
                return Ok(new { message = "OTP Generated (Email Simulated)", debugOtp = otp });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] OtpVerifyDto request)
        {
            if (_cache.TryGetValue(request.Contact, out string? storedOtp))
            {
                if (storedOtp == request.Otp)
                {
                    _cache.Remove(request.Contact); // Clear OTP to prevent reuse
                    return Ok(new { message = "OTP Verified Successfully" });
                }
            }
            return BadRequest(new { message = "Invalid or Expired OTP" });
        }

        // ==========================================
        // 2. USER REGISTRATION
        // ==========================================

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Contact == request.Contact))
            {
                return BadRequest(new { message = "User with this email/mobile already exists." });
            }

            // Create User Object
            var user = new User
            {
                FullName = request.FullName,
                Contact = request.Contact,
                PasswordHash = request.Password, // TODO: Use Hashing in production
                Gender = request.Gender,         // Field added in recent update
                Address = request.Address,
                State = request.State,
                District = request.District,
                Pincode = request.Pincode,
                Role = "Citizen",                // Default Role
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

        // ==========================================
        // 3. LOGIN
        // ==========================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request) 
        {
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Contact == request.Contact);

             if (user == null || user.PasswordHash != request.Password)
             {
                 return Unauthorized(new { message = "Invalid credentials" });
             }

             // Return User Info (Frontend uses 'role' for redirection)
             return Ok(new { 
                 message = "Login successful", 
                 userId = user.Id, 
                 fullName = user.FullName,
                 role = user.Role 
             });
        }

        // ==========================================
        // 4. ADMIN TOOLS (Staff Creation)
        // ==========================================

        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff(UserRegisterDto request, string role)
        {
            // Allow creation of specific roles (Admin, Worker)
            var validRoles = new[] { "Admin", "Worker", "SuperAdmin" };
            if (!validRoles.Contains(role))
            {
                return BadRequest(new { message = "Invalid Role. Allowed: Admin, Worker, SuperAdmin" });
            }

            var user = new User
            {
                FullName = request.FullName,
                Contact = request.Contact,
                PasswordHash = request.Password, 
                Role = role, 
                Gender = request.Gender,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{role} created successfully" });
        }
    }
}