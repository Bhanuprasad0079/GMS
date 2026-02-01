using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace GrievanceAPI.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // 1. X-Content-Type-Options: Prevents MIME-sniffing
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

            // 2. X-Frame-Options: Prevents Clickjacking (cannot be put in iframe)
            context.Response.Headers.Append("X-Frame-Options", "DENY");

            // 3. X-XSS-Protection: Enables browser XSS filters
            context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

            // 4. Referrer-Policy: Controls how much info is sent to external sites
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

            // 5. Content-Security-Policy (CSP): The strongest defense against XSS
            // This allows scripts/styles only from 'self' (your domain)
            // Warning: If you use external CDNs (like Google Fonts), add them here.
            context.Response.Headers.Append("Content-Security-Policy", 
                "default-src 'self'; " + 
                "img-src 'self' data: blob:; " + // Allow images from self + blobs (for your secure images)
                "script-src 'self'; " + 
                "style-src 'self' 'unsafe-inline'; " + // 'unsafe-inline' needed for some UI libraries
                "frame-ancestors 'none';"); // Blocks iframes

            await _next(context);
        }
    }
}