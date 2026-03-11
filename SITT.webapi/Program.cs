using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();

builder.Services.AddControllers();

var config = new Appconfig();
config.ApiKey = builder.Configuration["APIKey"]??throw new InvalidOperationException("Postmark API Key must be configured");
builder.Services.AddSingleton<Appconfig>(config);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    // This line deletes the old, mismatched database
    db.Database.EnsureDeleted(); 
    // This line creates a fresh one with your new Name and Count columns
    db.Database.EnsureCreated(); 
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

// Enable default files (e.g., index.html) to be served when a user visits the root URL.
app.UseDefaultFiles();

// Enable static files middleware to serve files from wwwroot.
//app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// If using controllers or Razor Pages, you might need these, but not strictly necessary for a simple HTML site
// app.MapRazorPages(); 
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
