using Muzik.Data;
using Muzik.Entities;
using Muzik.Extensions;
using Muzik.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

logger.LogInformation("Application starting...");
// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("http://localhost:3000"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var scopedLogger = services.GetRequiredService<ILogger<Program>>();

    await context.Database.MigrateAsync();

    await Seed.SeedPhotos(context, scopedLogger);
    await Seed.SeedUsers(context, userManager, roleManager);
    await Seed.SeedGenres(context);
    await Seed.SeedSongs(context);
    await Seed.SeedAlbums(context);
    await Seed.SeedPlaylists(context);
}
catch (Exception ex)
{
    var scopedLogger = services.GetRequiredService<ILogger<Program>>();
    scopedLogger.LogError(ex, "An error occurred during migration");
}

app.Run();