using PostmarkDotNet;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

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

PostmarkMessage message = new PostmarkMessage {
    From = "jpersinger@hsi.com",
    To = "jpersinger@hsi.com",
    Subject = "Hello from Postmark",
    HtmlBody = "<strong>Hello</strong> dear Postmark user.",
    TextBody = "Hello dear postmark user.",
    ReplyTo = "jpersinger@hsi.com",
    TrackOpens = true,
};


message.Headers.Add(new PostmarkDotNet.Model.MailHeader("X-Custom-Header", "value"));

PostmarkClient client = new PostmarkClient("POSTMARK_API_TEST");

PostmarkResponse response = await client.SendMessageAsync(message);

if(response.Status != PostmarkStatus.Success) {
    Console.WriteLine("Response was: " + response.Message);
}
