namespace SITT.Endpoints;

using Microsoft.AspNetCore.Identity;
using SITT.Models;
using SITT.Models.Requests;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapPost("/users/check", async (UserCheckRequest request, UserManager<User> userManager) =>
        {
            var user = await userManager.FindByNameAsync(request.Username);
            return Results.Ok(new { Exists = user != null });
        })
        .WithTags("Users")
        .WithName("CheckUserExists");
    }
}