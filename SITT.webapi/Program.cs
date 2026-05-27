using SITT.Extensions;
using SITT.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSITTServices(builder);

var app = builder.Build();

// app.EnsureDatabaseCreated();
app.ConfigureMiddleware();
app.MapNoteEndpoints();
app.MapUserEndpoints();

app.Run();