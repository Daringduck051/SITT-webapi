using Microsoft.AspNetCore.Mvc;
using PostmarkDotNet; // Make sure your NuGet package is installed!
using PostmarkDotNet.Model;
using Microsoft.AspNetCore.Authorization;
using SITT.Config;
using Microsoft.Extensions.Options;

namespace SITT.webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly AppConfig _config;
        private readonly EmailSettings _emailSettings;

        public EmailController(AppConfig config, IOptions<EmailSettings> emailSettingsOptions)
        {
            _config = config;
            _emailSettings = emailSettingsOptions.Value;
        }
        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            // 1. Validation
            if (request == null || string.IsNullOrEmpty(request.Subject)) {
                return BadRequest("Invalid request.");
            }

            // 2. Postmark Logic (Moved directly into the controller)
            var message = new PostmarkMessage()
            {
                To = _emailSettings.ToAddress,
                From = _emailSettings.FromAddress,
                Subject = request.Subject,
                TextBody = request.HtmlBody,
                Headers = new HeaderCollection(),
                Attachments = new List<PostmarkMessageAttachment>()
                
            };

            if (request.Attachments != null)
            {
                foreach (var a in request.Attachments)
                {
                    string cleanBase64 = a.Content.Trim();
                    byte[] fileBytes = Convert.FromBase64String(cleanBase64);

                    //message.AddAttachment(fileBytes, a.Filename, a.ContentType);\
                    message.Attachments.Add(new PostmarkMessageAttachment
                    {
                        Name = a.Filename,
                        Content = Convert.ToBase64String(fileBytes),
                        ContentType = a.ContentType
                    });
                }
            }

            //var client = new PostmarkClient("POSTMARK_API_TEST"); // Replace with your Postmark API key
            var client = new PostmarkClient(_config.ApiKey);

            try 
            {
                var response = await client.SendMessageAsync(message);

                if (response.Status == PostmarkStatus.Success)
                {
                    return Ok(new { message = "Email sent successfully!" });
                }
                return BadRequest(new { message = "Postmark error: " + response.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, "Server error: " + ex.Message);
            }
        }
    }

    // This class must exist for the [FromBody] to work
    public class EmailRequest
    {
        public string? Subject { get; set; }
        public string? HtmlBody { get; set; }
        public string? To { get; set; }
        public List<Attachment>? Attachments { get; set; }
    }

    public class Attachment
    {
        public string? Filename { get; set; }
        public string? Content { get; set; }
        public string? ContentType { get; set; }
    }
}