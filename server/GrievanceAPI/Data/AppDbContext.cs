using Microsoft.EntityFrameworkCore;
using GrievanceAPI.Models;

namespace GrievanceAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // This line creates a "Users" table in your database
        public DbSet<User> Users { get; set; }
    }
}