using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SITT.Models;

namespace SITT.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=app.db");
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>(entity =>
        {
            entity.Property(u => u.UserName)
                .UseCollation("BINARY");

            entity.Property(u => u.NormalizedUserName)
                .UseCollation("BINARY");

        });

        base.OnModelCreating(builder);

        builder.Entity<Note>()
            .HasKey(c => new { c.Id, c.UserId }); // Composite Key

        builder.Entity<Note>()
            .Property(c => c.Id)
            .ValueGeneratedNever(); // <--- CRITICAL: Stops the +1 behavior
    }
    public DbSet<Note> Notes { get; set; }
}