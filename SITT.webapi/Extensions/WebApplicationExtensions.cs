using SITT.Data;

namespace SITT.Extensions;

public static class WebApplicationExtensions
{
    public static void ConfigureMiddleware(this WebApplication app)
    {
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
    }
};

public static class WebApplicationDatabaseExtensions
{
    public static void EnsureDatabaseCreated(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            var appDb = services.GetRequiredService<AppDbContext>();
            // appDb.Database.EnsureDeleted();
            appDb.Database.EnsureCreated();
        }
    }
};