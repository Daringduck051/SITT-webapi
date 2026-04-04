namespace SITT.Controllers;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using SITT.Services;
using SITT.Models;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IEmailSender _emailSender;

    public AccountController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IEmailSender emailSender)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest payload)
    {
        var newUser = new User { 
            UserName = payload.Username,
            Email = payload.Email 
        };

        var result = await _userManager.CreateAsync(newUser, payload.Password);

        if (result.Succeeded)
        {
            return Ok(new { message = "User registered successfully!" });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest payload)
    {
        var result = await _signInManager.PasswordSignInAsync(
            payload.Username,
            payload.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (result.Succeeded)
        {
            return Ok(new { message = "Login successful!" });
        }

        return Unauthorized();
    }

    [HttpPost]
    [Route("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest payload)
    {
        var user = await _userManager.FindByNameAsync(payload.Username);

        if (user == null || string.IsNullOrEmpty(user.Email))
        {
            return Ok(new { message = "If an account exists, a reset link has been sent" });
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        
        var resetLink = $"http://localhost:5079/reset-password.html?token={encodedToken}&email={user.Email}";

        await _emailSender.SendPasswordResetLinkAsync(user, user.Email, resetLink);

        return Ok(new { message = "If an account exists, a reset link has been sent." });
    }

    [HttpPost]
    [Route("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest payload)
    {
        var user = await _userManager.FindByEmailAsync(payload.Email);
        if (user == null)
        {
            // Don't reveal if the user exists for security
            return Ok(new { message = "Password has been reset." });
        }

        // Decode the token we encoded earlier
        var decodedTokenBytes = WebEncoders.Base64UrlDecode(payload.Token);
        var actualToken = Encoding.UTF8.GetString(decodedTokenBytes);

        var result = await _userManager.ResetPasswordAsync(user, actualToken, payload.NewPassword);

        if (result.Succeeded)
        {
            return Ok(new { message = "Password has been reset successfully." });
        }

        return BadRequest(result.Errors);
    }
}