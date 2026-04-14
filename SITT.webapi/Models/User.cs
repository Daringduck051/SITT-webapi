namespace SITT.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

public class BannedPasswordValidator<TUser> : IPasswordValidator<TUser> where TUser : class
{
    private readonly List<string> _bannedPasswords = new List<string>
    {
        "Pass@123",
        "P@ssw0rd",
        "Abcd@123",
        "Pass!123",
        "Admin@12",
        "123@Abcd",
        "1@Passwd",
        "P@ss1234",
        "!Admin12",
        "User@123",
        "Qwer!123",
        "A@12345b",
        "S@fe1234",
        "P@ssword",
        "1234!Abc",
        "Password123!",
        "Password1234!",
        "P@ssword123!",
        "P@ssw0rd!",
        // Add more passwords here as needed
    };

    public Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user, string password)
    {
        if (_bannedPasswords.Contains(password))
        {
            return Task.FromResult(IdentityResult.Failed(new IdentityError
            {
                Code = "BannedPassword",
                Description = "This password is too common and cannot be used."
            }));
        }

        // You can also call the base validator's logic if desired (for .NET Framework Identity)
        // For .NET Core Identity, the default validator is added separately.
        return Task.FromResult(IdentityResult.Success);
    }
}

public class User : IdentityUser<int>
{
    public ICollection<Note> Notes {get; set;} = [];
}
public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password, string Email);
public record ForgotPasswordRequest(string Username);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);

