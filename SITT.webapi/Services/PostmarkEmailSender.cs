using Microsoft.AspNetCore.Identity;
using SITT.Models;

namespace SITT.Services;

public class PostmarkEmailSender : IEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly string _apikey;

    public PostmarkEmailSender(HttpClient httpClient, Appconfig config)
    {
        _httpClient = httpClient;
        _apikey = config.ApiKey;
    }

    public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        var payload = new
        {
            From = "jpersinger@hsi.com",
            To = "jpersinger@hsi.com",
            Subject = "Reset your password",
            HtmlBody = $"<html><body><p>Hello {user.UserName},</p><p>Please reset your password by <a href='{resetLink}'>clicking here</a>.</p><p>Link will expire in 10 minutes</p></body></html>",
            MessageStream = "outbound"
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.postmarkapp.com/email")
        {
            Headers = 
            {
                { "X-Postmark-Server-Token", _apikey },
                { "Accept", "application/json" }
            },
            Content = JsonContent.Create(payload)
        };

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to send email via Postmark: {error}");
        }
    }

    public Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        return Task.CompletedTask;
    }
    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        return Task.CompletedTask;
    }
}

public interface IEmailSender
{
    Task SendPasswordResetLinkAsync(User user, string email, string resetLink);
}