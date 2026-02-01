using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;

namespace GrievanceAPI.Services
{
    public class ImageSecurityService
    {
        // 1. Define Magic Numbers (File Signatures) for Validation
        private static readonly Dictionary<string, List<byte[]>> _fileSignatures = new()
        {
            { ".jpeg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
            { ".jpg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
            { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
            { ".webp", new List<byte[]> { new byte[] { 0x52, 0x49, 0x46, 0x46 }, new byte[] { 0x57, 0x45, 0x42, 0x50 } } }
        };

        private readonly string _uploadPath;

        public ImageSecurityService()
        {
            // 2. Store outside Web Root (Private Folder)
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "PrivateUploads");
            if (!Directory.Exists(_uploadPath)) Directory.CreateDirectory(_uploadPath);
        }

        public async Task<string> SaveSecureImageAsync(IFormFile file)
        {
            // 3. Enforce Max File Size (5MB)
            if (file.Length > 5 * 1024 * 1024) throw new Exception("File exceeds 5MB limit.");

            // 4. Validate Extension
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_fileSignatures.ContainsKey(ext)) throw new Exception("Invalid file type.");

            // 5. Validate File Signature (Prevent Extension Spoofing)
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                if (!ValidateSignature(stream, ext)) throw new Exception("File signature mismatch detected.");

                // 6. Re-encode & Strip Metadata (EXIF)
                stream.Position = 0;
                using (var image = Image.Load(stream))
                {
                    // Rename to Random GUID
                    string newFileName = $"{Guid.NewGuid()}{ext}";
                    string fullPath = Path.Combine(_uploadPath, newFileName);

                    // Re-save (Strips metadata and rewrites bitstream)
                    if (ext == ".png") await image.SaveAsPngAsync(fullPath);
                    else if (ext == ".webp") await image.SaveAsWebpAsync(fullPath);
                    else await image.SaveAsJpegAsync(fullPath); 

                    return newFileName; // Return filename to save in DB
                }
            }
        }

        public FileStream GetImageStream(string fileName)
        {
            string path = Path.Combine(_uploadPath, fileName);
            if (!File.Exists(path)) throw new FileNotFoundException();
            return new FileStream(path, FileMode.Open, FileAccess.Read);
        }

        public string GetContentType(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return ext switch { ".png" => "image/png", ".webp" => "image/webp", _ => "image/jpeg" };
        }

        private bool ValidateSignature(Stream stream, string ext)
        {
            using (var reader = new BinaryReader(stream, System.Text.Encoding.Default, true))
            {
                var headerBytes = reader.ReadBytes(12);
                foreach (var signature in _fileSignatures[ext])
                {
                    var headerSlice = headerBytes.Take(signature.Length).ToArray();
                    if (headerSlice.SequenceEqual(signature)) return true;
                    // WebP check (RIFF...WEBP)
                    if (ext == ".webp" && headerBytes.Length >= 12)
                        if (headerBytes[0] == 0x52 && headerBytes[8] == 0x57 && headerBytes[11] == 0x50) return true;
                }
            }
            return false;
        }
    }
}