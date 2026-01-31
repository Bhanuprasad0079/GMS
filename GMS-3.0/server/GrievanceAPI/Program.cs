using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using GrievanceAPI.Data;
using GrievanceAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add services to the container. ---

builder.Services.AddControllers();
builder.Services.AddMemoryCache();

// Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- SECURITY: RATE LIMITING (Prevent DoS Attacks) ---
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100, // Max 100 requests
                Window = TimeSpan.FromMinutes(1) // Per 1 minute
            }));
    
    options.RejectionStatusCode = 429; // Too Many Requests
});

// --- SECURITY: JWT AUTHENTICATION (COOKIE BASED) ---
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var key = Encoding.UTF8.GetBytes(jwtKey);

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

     // --- CRITICAL SECURITY: READ TOKEN FROM COOKIE ---
     options.Events = new JwtBearerEvents
     {
         OnMessageReceived = context =>
         {
             // Look for the "authToken" cookie
             var token = context.Request.Cookies["authToken"];
             if (!string.IsNullOrEmpty(token))
             {
                 context.Token = token;
             }
             return Task.CompletedTask;
         }
     };
 });

// --- CORS CONFIGURATION (ALLOW COOKIES) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Frontend URL
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // <--- REQUIRED for Cookies to work
    });
});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 2. Configure the HTTP request pipeline. ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- SECURITY: RATE LIMITING ---
app.UseRateLimiter(); 

// --- SECURITY: CORS ---
app.UseCors("AllowNextJs"); 

// --- SECURITY: AUTHENTICATION & AUTHORIZATION ---
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();