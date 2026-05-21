namespace SITT.Extensions;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SITT.Config;
using SITT.Data;
using SITT.Models;
using SITT.Services.Identity;
using SITT.Services;

public static class ServiceCollectionExtensions
{
    public static void AddSITTServices(this IServiceCollection services, WebApplicationBuilder builder)
    {

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddSingleton<ILookupNormalizer, NoOpLookupNormalizer>();
builder.Services.AddSingleton<IEmailSender<User>, NoOpEmailSender>();

builder.Services.AddHttpClient<IEmailSender, PostmarkEmailSender>();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));


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
    options.User.RequireUniqueEmail = true;
});

// builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
// {
//     options.TokenLifespan = TimeSpan.FromMinutes(10);
// });

// builder.Services.AddAuthentication().AddMicrosoftAccount(microsoftOptions =>
// {
//     microsoftOptions.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
//     microsoftOptions.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];
// });

var config = new AppConfig();
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
    }};