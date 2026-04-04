using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using SITT.Data;
using SITT.Models;
using SITT.Services;
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

// builder.Services.AddIdentityApiEndpoints<User>()
//     .AddRoles<IdentityRole<int>>() 
//     .AddEntityFrameworkStores<AppDbContext>()
//     .AddDefaultTokenProviders()
//     .AddPasswordValidator<BannedPasswordValidator<User>>();

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

var config = new Appconfig();
config.ApiKey = builder.Configuration["APIKey"]??throw new InvalidOperationException("Postmark API Key must be configured");
builder.Services.AddSingleton(config);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var persistenceDb = services.GetRequiredService<MyDbContext>();
    persistenceDb.Database.EnsureCreated();

    var appDb = services.GetRequiredService<AppDbContext>();
    appDb.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// app.MapIdentityApi<User>();

app.MapControllers();

app.MapControllerRoute(name: "default", pattern: "{controller=EmailController}/{action=Index}/{id?}");

app.MapGet("/test-save", async (MyDbContext db) =>
{
    var note = new Note { Name = "Persistence is working!" };
    db.Notes.Add(note);
    await db.SaveChangesAsync();
    return $"Saved at {DateTime.Now}";
});

app.MapGet("/notes", async (MyDbContext db) => 
    await db.Notes.ToListAsync());

app.MapPost("/notes", async (MyDbContext db, List<Note> notes) =>
{
    db.Notes.RemoveRange(db.Notes);
    db.Notes.AddRange(notes);
    await db.SaveChangesAsync();
    return Results.Ok(notes);
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
