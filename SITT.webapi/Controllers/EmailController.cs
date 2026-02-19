using Microsoft.AspNetCore.Mvc;
using PostmarkDotNet; // Make sure your NuGet package is installed!
using PostmarkDotNet.Model;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;

namespace SITT.webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            // 1. Validation
            if (request == null || string.IsNullOrEmpty(request.Subject)) {
                return BadRequest("Invalid request.");
            }

            // 2. Postmark Logic (Moved directly into the controller)
            var message = new PostmarkMessage()
            {
                To = "jpersinger@hsi.com", // Replace with your recipient
                From = "jpersinger@hsi.com", // Replace with your Postmark sender
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
            var client = new PostmarkClient("8fc0c94b-b263-4d78-876a-f6dbf8214adf");

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