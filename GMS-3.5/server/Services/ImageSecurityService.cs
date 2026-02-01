using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GrievanceAPI.Services
{
    public class ImageSecurityService
    {
        private readonly Cloudinary _cloudinary;

        public ImageSecurityService(IConfiguration config)
        {
            // Initializes Cloudinary with keys from appsettings.json (or Render Env Variables)
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> SaveSecureImageAsync(IFormFile file)
        {
            // 1. Basic Validation
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(ext)) throw new Exception("Invalid file type.");
            if (file.Length > 5 * 1024 * 1024) throw new Exception("File too large (Max 5MB).");

            // 2. Upload to Cloudinary
            // We stream the file directly to Cloudinary (no local saving)
            using var stream = file.OpenReadStream();
            
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                // "auto" lets Cloudinary pick the best format/quality for the user's device
                Transformation = new Transformation().Quality("auto").FetchFormat("auto"), 
                Folder = "grievance_proofs"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            // Return the Secure Public URL (https://...) so we can save it to the DB
            return uploadResult.SecureUrl.ToString();
        }
        
        // Note: The old GetImageStream method is removed. 
        // We now serve images directly from the Cloudinary URL.
    }
}