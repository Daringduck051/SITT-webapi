using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SITT.Data;
using SITT.Models;

namespace SITT.webapi.Tests;

public class NotesEndpointsTests
{
    [Fact]
    public async Task PostNotes_UpsertsCurrentUsersNotes_AndLeavesOtherUsersUntouched()
    {
        await using var factory = new TestApplicationFactory();
        await factory.InitializeDatabaseAsync();

        // Arrange: seed one note for the signed-in user and one for a different user.
        using (var arrangeScope = factory.Services.CreateScope())
        {
            var db = arrangeScope.ServiceProvider.GetRequiredService<AppDbContext>();
            SeedUsers(db, 42, 99);
            db.Notes.AddRange(
                CreateNote(id: 1, userId: 42, name: "Phone", count: 1, shiftSent: false),
                CreateNote(id: 1, userId: 99, name: "Phone", count: 8, shiftSent: true));
            await db.SaveChangesAsync();
        }

        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });

        var incomingNotes = new[]
        {
            new Note { Id = 1, Name = "Phone", Count = 5, ShiftSent = true },
            new Note { Name = "Walk-up", Count = 2, ShiftSent = false }
        };

        // Act: post the latest note state exactly like the frontend would.
        var response = await client.PostAsJsonAsync("/notes", incomingNotes);

        // Assert: the current user's note is updated, a new note is inserted, and another user's data is untouched.
        response.EnsureSuccessStatusCode();

        using var assertScope = factory.Services.CreateScope();
        var assertDb = assertScope.ServiceProvider.GetRequiredService<AppDbContext>();

        var currentUserNotes = await assertDb.Notes
            .Where(note => note.UserId == 42)
            .OrderBy(note => note.Id)
            .ToListAsync();

        Assert.Collection(
            currentUserNotes,
            note =>
            {
                Assert.Equal(1, note.Id);
                Assert.Equal("Phone", note.Name);
                Assert.Equal(5, note.Count);
                Assert.True(note.ShiftSent);
            },
            note =>
            {
                Assert.Equal(2, note.Id);
                Assert.Equal("Walk-up", note.Name);
                Assert.Equal(2, note.Count);
                Assert.False(note.ShiftSent);
            });

        var otherUsersNote = await assertDb.Notes.SingleAsync(note => note.UserId == 99 && note.Name == "Phone");
        Assert.Equal(8, otherUsersNote.Count);
        Assert.True(otherUsersNote.ShiftSent);
    }

    [Fact]
    public async Task PostNotes_WhenBuiltinThemeIsReset_RemovesOnlyThatUsersCustomThemes()
    {
        await using var factory = new TestApplicationFactory();
        await factory.InitializeDatabaseAsync();

        // Arrange: seed built-in notes plus custom themes for the current user and a custom theme for a different user.
        using (var arrangeScope = factory.Services.CreateScope())
        {
            var db = arrangeScope.ServiceProvider.GetRequiredService<AppDbContext>();
            SeedUsers(db, 42, 99);
            db.Notes.AddRange(
                CreateNote(id: 1, userId: 42, name: "Phone", count: 3, shiftSent: true),
                CreateNote(id: 2, userId: 42, name: "Email", count: 2, shiftSent: true),
                CreateNote(id: 6, userId: 42, name: "VIP Follow-up", count: 4, shiftSent: true),
                CreateNote(id: 7, userId: 42, name: "Escalation", count: 1, shiftSent: true),
                CreateNote(id: 6, userId: 99, name: "Other User Custom", count: 9, shiftSent: true));
            await db.SaveChangesAsync();
        }

        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });

        var incomingNotes = new[]
        {
            new Note { Id = 1, Name = "Phone", Count = 0, ShiftSent = false }
        };

        // Act: simulate the start of a new shift by posting an updated built-in note.
        var response = await client.PostAsJsonAsync("/notes", incomingNotes);

        // Assert: only the signed-in user's custom themes are removed, which protects the next shift from stale custom categories.
        response.EnsureSuccessStatusCode();

        using var assertScope = factory.Services.CreateScope();
        var assertDb = assertScope.ServiceProvider.GetRequiredService<AppDbContext>();

        var currentUserNotes = await assertDb.Notes
            .Where(note => note.UserId == 42)
            .OrderBy(note => note.Id)
            .ToListAsync();

        Assert.Equal(2, currentUserNotes.Count);
        Assert.DoesNotContain(currentUserNotes, note => note.Id > 5);

        var phoneNote = Assert.Single(currentUserNotes, note => note.Id == 1);
        Assert.Equal(0, phoneNote.Count);
        Assert.False(phoneNote.ShiftSent);

        var otherUsersCustomTheme = await assertDb.Notes.SingleAsync(note => note.UserId == 99 && note.Id == 6);
        Assert.Equal("Other User Custom", otherUsersCustomTheme.Name);
    }

    private static Note CreateNote(int id, int userId, string name, int count, bool shiftSent)
    {
        return new Note
        {
            Id = id,
            UserId = userId,
            Name = name,
            Count = count,
            ShiftSent = shiftSent
        };
    }

    private static void SeedUsers(AppDbContext db, params int[] userIds)
    {
        foreach (var userId in userIds)
        {
            db.Users.Add(new User
            {
                Id = userId,
                UserName = $"user{userId}",
                NormalizedUserName = $"USER{userId}",
                Email = $"user{userId}@example.com",
                NormalizedEmail = $"USER{userId}@EXAMPLE.COM"
            });
        }
    }
}