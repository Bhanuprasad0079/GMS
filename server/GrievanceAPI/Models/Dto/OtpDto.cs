namespace GrievanceAPI.Models.Dto
{
    public class OtpRequestDto
    {
        public string Contact { get; set; } = string.Empty; // The Email/Phone
    }

    public class OtpVerifyDto
    {
        public string Contact { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}