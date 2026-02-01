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
                CreatedAt = DateTime.UtcNow,
                // Initialize Security Fields
                FailedLoginAttempts = 0,
                LockoutEnd = null
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful!" });
        }

        // --- UPGRADED LOGIN (Rate Limiting + Lockout) ---
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            // 1. Artificial Delay to slow down brute-force scripts
            await Task.Delay(500); 

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) 
                return Unauthorized(new { message = "Invalid email or password" }); // Generic error for security

            // 2. CHECK LOCKOUT STATUS
            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                var timeLeft = user.LockoutEnd.Value - DateTime.UtcNow;
                return StatusCode(423, new { message = $"Account locked. Try again in {Math.Ceiling(timeLeft.TotalMinutes)} minutes." });
            }

            // 3. VERIFY PASSWORD
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                // Increment Failure Count
                user.FailedLoginAttempts++;

                // Lock if attempts >= 5
                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    user.FailedLoginAttempts = 0; // Reset count so they start fresh after lockout
                    await _context.SaveChangesAsync();
                    return StatusCode(423, new { message = "Too many failed attempts. Account locked for 15 minutes." });
                }

                await _context.SaveChangesAsync();
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // 4. SUCCESS: RESET SECURITY COUNTERS
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            await _context.SaveChangesAsync();

            // 5. GENERATE TOKEN
            var tokenString = GenerateJwtToken(user);

            // 6. SET SECURE COOKIE
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,        // Prevent XSS
                Secure = true,          // Required for SameSite=None
                SameSite = SameSiteMode.None, // Allow cross-origin (Front:3000 -> Back:5087)
                Expires = DateTime.UtcNow.AddDays(1)
            };

            Response.Cookies.Append("authToken", tokenString, cookieOptions);

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
                SameSite = SameSiteMode.None // Must match Login options to successfully delete
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
            // Reset security counters on successful password reset
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            
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

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            // Unlock account if admin resets password
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            
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
                Department = request.Role == "Worker" ? request.Department : "",
                Gender = request.Gender,
                Address = request.Address,
                State = request.State,
                District = request.District,
                Pincode = request.Pincode,
                CreatedAt = DateTime.UtcNow,
                FailedLoginAttempts = 0,
                LockoutEnd = null
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

            // 1. Unassign Worker from Tickets
            var assignedTickets = await _context.Tickets.Where(t => t.AssignedWorkerId == user.Id).ToListAsync();
            foreach (var ticket in assignedTickets)
            {
                ticket.AssignedWorkerId = null;
                ticket.Status = "OPEN";
            }

            // 2. Delete Created Tickets
            var createdTickets = await _context.Tickets.Where(t => t.CreatorId == user.Id).ToListAsync();
            if (createdTickets.Any())
            {
                _context.Tickets.RemoveRange(createdTickets);
            }

            // 3. Delete User
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
                    Department = u.Department ?? "General" 
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
                    Department = u.Department ?? "",
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
            // Upgraded to HmacSha512 for stronger signing
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

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