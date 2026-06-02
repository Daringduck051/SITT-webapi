namespace SITT.Endpoints;

using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SITT.Extensions;
using SITT.Data;

public static class NoteEndpoints
{
    public static void MapNoteEndpoints(this WebApplication app)
    {
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
            existing.ShiftSent = incomingNote.ShiftSent;

            if (existing.Id <= 5 && incomingNote.Id < 5)
            {
                // If new shift, we need to remove custom themes
                var customThemes = userNotes.Where(n => n.Id > 5).ToList();
                db.Notes.RemoveRange(customThemes);
                userNotes.RemoveAll(n => n.Id > 5);
            }
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
    }
}