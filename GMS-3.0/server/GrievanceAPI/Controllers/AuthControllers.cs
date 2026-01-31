using Microsoft.AspNetCore.Mvc;
using GrievanceAPI.Data;
using GrievanceAPI.Models;
using GrievanceAPI.Models.Dto;
using GrievanceAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace GrievanceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IMemoryCache cache, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _cache = cache;
            _emailService = emailService;
            _configuration = configuration;
        }

        // --- OTP METHODS ---

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] OtpRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Email)) return BadRequest(new { message = "Email required." });
            
            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            _cache.Set(request.Email, otp, TimeSpan.FromMinutes(5));
            try
            {
                await _emailService.SendEmailAsync(request.Email, "Verification Code", $"Your OTP is: {otp}");
                return Ok(new { message = "OTP sent to email." });
            }
            catch
            {
                return Ok(new { message = "OTP Generated (Dev Mode)", debugOtp = otp });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] OtpVerifyDto request)
        {
            if (_cache.TryGetValue(request.Email, out string? storedOtp) && storedOtp == request.Otp)
            {
                return Ok(new { message = "OTP Verified" });
            }
            return BadRequest(new { message = "Invalid OTP" });
        }

        // --- AUTH METHODS ---

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "User already exists with this email." });

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email, 
                PasswordHash = passwordHash,
                Gender = request.Gender,
                Address = request.Address,
                State = request.State,
                District = request.District,
                Pincode = request.Pincode,
                Role = "Citizen",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            await Task.Delay(500); // Rate limit protection

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var tokenString = GenerateJwtToken(user);

            // --- SET SECURE COOKIE ---
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,        // CRITICAL: Javascript cannot read this
                Secure = true,          // CRITICAL: Only send over HTTPS (or localhost)
                SameSite = SameSiteMode.Strict, // CRITICAL: Blocks CSRF attacks
                Expires = DateTime.UtcNow.AddDays(1) // Token expiration
            };

            Response.Cookies.Append("authToken", tokenString, cookieOptions);

            // --- RETURN SAFE DATA ONLY ---
            return Ok(new
            {
                message = "Login successful",
                userId = user.Id,
                fullName = user.FullName,
                role = user.Role
            });
        }

        [Authorize] 
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirst("Id")?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            // Return safe UI data (No token, no password)
            return Ok(new 
            { 
                userId = user.Id, 
                fullName = user.FullName, 
                role = user.Role,
                email = user.Email
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (!_cache.TryGetValue(request.Email, out string? storedOtp) || storedOtp != request.Otp)
                return BadRequest(new { message = "Invalid OTP." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return NotFound(new { message = "User not found." });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            _cache.Remove(request.Email);
            return Ok(new { message = "Password updated." });
        }


        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("force-reset-password")]
        public async Task<IActionResult> ForceResetPassword([FromBody] ForceResetDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return NotFound(new { message = "User not found." });

            // Overwrite with new hash
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Password for {user.FullName} has been reset." });
        }

        // --- ADMIN METHODS ---

        [Authorize(Roles = "SuperAdmin")] 
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto request)
        {
            var validRoles = new[] { "Admin", "Worker", "SuperAdmin" };
            if (!validRoles.Contains(request.Role, StringComparer.OrdinalIgnoreCase))
                return BadRequest(new { message = "Invalid Role." });

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "User exists." });

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = request.Role,
                
                // Save Department if Worker
                Department = request.Role == "Worker" ? request.Department : "",

                Gender = request.Gender,
                Address = request.Address,
                State = request.State,
                District = request.District,
                Pincode = request.Pincode,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{request.Role} created successfully" });
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("delete-user/{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return NotFound(new { message = "User not found." });

            // --- STEP 1: Handle Worker Assignments ---
            // If this user is a Worker, we must unassign them from any active tickets
            var assignedTickets = await _context.Tickets.Where(t => t.AssignedWorkerId == user.Id).ToListAsync();
            if (assignedTickets.Any())
            {
                foreach (var ticket in assignedTickets)
                {
                    ticket.AssignedWorkerId = null; // Remove the worker link
                    ticket.Status = "OPEN";         // Reset status so another worker can pick it up
                }
            }

            // --- STEP 2: Handle Created Tickets ---
            // If this user is a Citizen, we must delete their tickets because a ticket requires a CreatorId
            var createdTickets = await _context.Tickets.Where(t => t.CreatorId == user.Id).ToListAsync();
            if (createdTickets.Any())
            {
                _context.Tickets.RemoveRange(createdTickets);
            }

            // --- STEP 3: Delete the User ---
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User and their associated data have been deleted." });
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("get-workers")]
        public async Task<IActionResult> GetWorkers()
        {
            var workers = await _context.Users
                .Where(u => u.Role == "Worker")
                .Select(u => new 
                { 
                    u.Id, 
                    u.FullName, 
                    u.Email,
                    Department = u.Department ?? "General" // Safe handling of nulls
                })
                .ToListAsync();
            return Ok(workers);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role,
                    Department = u.Department ?? "", // Safe handling of nulls
                    u.Gender,
                    u.Address,
                    u.CreatedAt
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}