var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();

var app = builder.Build();

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
// app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
