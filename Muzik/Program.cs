using Muzik.Data;
using Muzik.Entities;
using Muzik.Extensions;
using Muzik.Middleware;
using Microsoft.IdentityModel.Logging;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();

// Configure environment-specific settings
if (builder.Environment.IsProduction())
{
    // Use environment variables in production
    builder.Configuration.AddEnvironmentVariables();

    // Override connection string from environment variable if present
    var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
    if (!string.IsNullOrEmpty(connectionString))
    {
        builder.Configuration.GetSection("ConnectionStrings")["DefaultConnection"] = connectionString;
    }
}

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

IdentityModelEventSource.ShowPII = true;
builder.Services.AddSwaggerGen();
builder.Logging.AddConsole(options =>
{
    options.LogToStandardErrorThreshold = LogLevel.Information;
});
var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

logger.LogInformation("Application starting...");

app.UseMiddleware<ExceptionMiddleware>();

// Configure CORS based on environment
if (app.Environment.IsDevelopment())
{
    app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
        .WithOrigins("http://localhost:3000"));
}
else
{
    var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?.Split(',')
        ?? new[] { "https://*.vercel.app" };
    
    app.UseCors(x => x.AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins(allowedOrigins));
}

app.UseAuthentication();
app.UseAuthorization();

// Enable Swagger middleware in the request pipeline
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; 
});
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

    await Seed.SeedPhotos(context);
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
