
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using GrievanceAPI.Data; 
using GrievanceAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add services to the container. ---

builder.Services.AddControllers();

builder.Services.AddMemoryCache();

// Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// START: CORS CONFIGURATION

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // This is Next.js URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// END: CORS CONFIGURATION

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 2. Configure the HTTP request pipeline. ---

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// APPLY CORS POLICY (Must be before Authorization)

app.UseCors("AllowNextJs"); 

app.UseAuthorization();

app.MapControllers();

app.Run();