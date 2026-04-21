using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using SITT.Data;
using SITT.Models;
using SITT.Services;
using System.Security.Claims;
using SITT.Controllers;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddSingleton<ILookupNormalizer, NoOpLookupNormalizer>();
builder.Services.AddSingleton<IEmailSender<User>, NoOpEmailSender>();

builder.Services.AddHttpClient<IEmailSender, PostmarkEmailSender>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders()
    .AddPasswordValidator<BannedPasswordValidator<User>>();

// builder.Services.AddDefaultIdentity<IdentityUser>()
//     .AddRoles<IdentityRole>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
});

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;
});

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromMinutes(10);
});

// builder.Services.AddAuthentication().AddMicrosoftAccount(microsoftOptions =>
// {
//     microsoftOptions.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
//     microsoftOptions.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];
// });

var config = new Appconfig();
config.ApiKey = builder.Configuration["APIKey"]??throw new InvalidOperationException("Postmark API Key must be configured");
builder.Services.AddSingleton(config);

builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7240;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5079); // HTTP
    options.ListenLocalhost(7240, listenOptions => listenOptions.UseHttps()); // HTTPS
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var appDb = services.GetRequiredService<AppDbContext>();
    // appDb.Database.EnsureDeleted();
    appDb.Database.EnsureCreated();
}
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(name: "default", pattern: "{controller=EmailController}/{action=Index}/{id?}");

app.MapGet("/test-save", async (AppDbContext db) =>
{
    var note = new Note { Name = "Persistence is working!" };
    db.Notes.Add(note);
    await db.SaveChangesAsync();
    return $"Saved at {DateTime.Now}";
});

app.MapGet("/notes", async (ClaimsPrincipal user, AppDbContext db) => 
{
    int userId = user.GetUserId();
    if (userId == 0) return Results.Unauthorized();

    // Fetch only the notes belonging to the logged-in user
    var myNotes = await db.Notes
        .Where(n => n.UserId == userId)
        .ToListAsync();

    return Results.Ok(myNotes);
});

app.MapPost("/notes", async (ClaimsPrincipal user, AppDbContext db, List<Note> incomingNotes) => 
{
    int userId = user.GetUserId();
    if (userId == 0) return Results.Unauthorized();

    // 1. Get all existing notes for this user into memory once (Better performance)
    var userNotes = await db.Notes
        .Where(n => n.UserId == userId)
        .ToListAsync();

    foreach (var incomingNote in incomingNotes)
    {
        var existing = userNotes.FirstOrDefault(n => n.Name == incomingNote.Name);

        if (existing != null)
        {
            // UPDATE: Modify the tracked object directly
            existing.Count = incomingNote.Count;
        }
        else
        {
            // INSERT: Calculate the next ID for this user
            int nextId = (userNotes.Any() ? userNotes.Max(n => n.Id) : 0) + 1;
            
            // If a custom theme is created it will start with ID = 6
            if (nextId <= 5 && userNotes.Count >= 5) nextId = 6; 

            incomingNote.Id = nextId;
            incomingNote.UserId = userId;
            
            db.Notes.Add(incomingNote);

            userNotes.Add(incomingNote);
        }
    }

    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapPost("/check-user", async (UserCheckRequest request, UserManager<User> userManager) => 
{
    var user = await userManager.FindByNameAsync(request.Username);
    return Results.Ok(new { exists = user != null });
});

app.Run();

public class Appconfig
{
    public string ApiKey {get; set;}
}

public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
    : base(options)
    {
    }

    public DbSet<Note> Notes { get; set; }
}

public class NoOpLookupNormalizer : ILookupNormalizer
{
    public string? NormalizeEmail(string? email) => email;
    public string? NormalizeName(string? name) => name;
};
public class NoOpEmailSender : IEmailSender<User>
{
    public Task SendConfirmationLinkAsync(User user, string email, string confirmationLink) => Task.CompletedTask;
    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink) => Task.CompletedTask;
    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode) => Task.CompletedTask;
}
public record UserCheckRequest(string Username);
public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        // Check for the long URI first, then the short 'sub'
        var claim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null) return 0;

        return int.TryParse(claim.Value, out var id) ? id : 0;
    }
}
