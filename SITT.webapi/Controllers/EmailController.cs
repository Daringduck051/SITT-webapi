using Microsoft.AspNetCore.Mvc;
using PostmarkDotNet; // Make sure your NuGet package is installed!
using PostmarkDotNet.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

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
                To = "jpersinger@hsi.com",
                From = "jpersinger@hsi.com", // Replace with your Postmark sender
                Subject = "Hello " + request.Subject,
                TextBody = "Welcome to our app!",
                Headers = new HeaderCollection()
                
            };

            var client = new PostmarkClient("POSTMARK_API_TEST");

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
    }
}