using Microsoft.EntityFrameworkCore;

namespace SITT.Data;

public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    // This is the bridge to your "Notes" table
    public DbSet<Note> Notes { get; set; }
}