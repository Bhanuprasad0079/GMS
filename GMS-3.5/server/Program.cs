using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using GrievanceAPI.Data;
using GrievanceAPI.Services;
using GrievanceAPI.Middleware; // Ensure you created the Middleware folder
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http;
using Npgsql.EntityFrameworkCore.PostgreSQL;


var builder = WebApplication.CreateBuilder(args);

// --- 1. SERVICE REGISTRATION ---

builder.Services.AddControllersWithViews();
builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor(); // Required for accessing IP/User info

// Register Custom Services
builder.Services.AddScoped<ImageSecurityService>(); // Secure Image Handling
builder.Services.AddScoped<IEmailService, EmailService>(); // Email Notifications

// Database Connection
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- SECURITY: CSRF (ANTI-FORGERY) ---
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN"; // Frontend must send this header
    options.SuppressXFrameOptionsHeader = false;
});

// --- SECURITY: RATE LIMITING (DoS Protection) ---
builder.Services.AddRateLimiter(options =>
{
    // 1. Upload Policy (Strict)
    options.AddPolicy("UploadPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 5, // Max 5 uploads per minute
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    // 2. Global Policy (Standard)
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100, // Max 100 requests per minute
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    
    options.RejectionStatusCode = 429; // Return "Too Many Requests"
});

// --- SECURITY: JWT AUTHENTICATION (Cookie-Based) ---
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var key = Encoding.UTF8.GetBytes(jwtKey!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = jwtIssuer,
         ValidAudience = jwtAudience,
         IssuerSigningKey = new SymmetricSecurityKey(key)
     };

     // --- CRITICAL: Extract Token from HttpOnly Cookie ---
     options.Events = new JwtBearerEvents
     {
         OnMessageReceived = context =>
         {
             var token = context.Request.Cookies["authToken"];
             if (!string.IsNullOrEmpty(token))
             {
                 context.Token = token;
             }
             return Task.CompletedTask;
         }
     };
 });

// --- SECURITY: CORS POLICY ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://gms-sigma.vercel.app") 
        // // Frontend Origin
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials() // REQUIRED for Cookies/Auth
              .WithExposedHeaders("X-XSRF-TOKEN"); // Allow reading CSRF token
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 2. HTTP REQUEST PIPELINE (Order Matters!) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts(); // Enforce HTTPS in Production
}

app.UseHttpsRedirection();

// 1. Security Headers (Middleware)
// Ensure you have created `SecurityHeadersMiddleware.cs` in `Middleware` folder
app.UseMiddleware<SecurityHeadersMiddleware>();

// 2. Static Files (If serving public assets)
app.UseStaticFiles(); 

// 3. CORS (Must be before Auth & CSRF)
app.UseCors("AllowNextJs"); 

// 4. Rate Limiting (Protect Resources)
app.UseRateLimiter(); 

// 5. Authentication (Identify User)
app.UseAuthentication();

// 6. Authorization (Check Permissions)
app.UseAuthorization();

// 7. CSRF Token Generation Middleware (Double Submit Cookie Pattern)
var antiforgery = app.Services.GetRequiredService<Microsoft.AspNetCore.Antiforgery.IAntiforgery>();

app.Use(async (context, next) =>
{
    string path = context.Request.Path.Value?.ToLower() ?? "";

    // Generate CSRF token for API calls
    if (path.StartsWith("/api"))
    {
        var tokens = antiforgery.GetAndStoreTokens(context);
        
        // Send token in a readable cookie (Not HttpOnly) so Frontend can read it
        context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, 
            new CookieOptions { HttpOnly = false, Secure = true, SameSite = SameSiteMode.None });
    }

    await next(context);
});

app.MapControllers();

app.Run();