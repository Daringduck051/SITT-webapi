namespace SITT.Controllers;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SITT.Models;

public class AccountController : Controller
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AccountController(
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest payload)
    {
        var newUser = new User { UserName = payload.Username };

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


    // [HttpPost]
    // [Route("forgot-password")]
    // public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest payload)
    // {
    //     var user = await _userManager.FindByNameAsync(payload.Username);

    //     if (user == null || string.IsNullOrEmpty(user.Email))
    //     {
    //         return Ok(new { message = "If an account exists, a reset link has been sent"} );
    //     }

    //     var token = await _userManager.GeneratePasswordResetTokenAsync(user);

    //     var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

    //     var resetLink = $"http://127.0.0.1:5079/reset-password.html?token={encodedToken}&email={user.Email}";

    //     await _emailSender.SendPasswordResetLinkAsync(user, user.Email, resetLink);

    //     return Ok(new { message = "If an account exists, a reset link has been sent." });
    // }
}