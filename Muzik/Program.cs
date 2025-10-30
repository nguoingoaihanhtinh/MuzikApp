using System.Net;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Muzik.Data;
using Muzik.Entities;
using Muzik.Extensions;
using Muzik.Middleware;

AppContext.SetSwitch("System.Net.DontEnableIPv6", true);

var builder = WebApplication.CreateBuilder(args);

// Logging setup
builder.Logging.AddConsole(options =>
{
    options.LogToStandardErrorThreshold = LogLevel.Information;
});

// Configure environment-specific settings
if (builder.Environment.IsProduction())
{
    builder.Configuration.AddEnvironmentVariables();

    // Support both CONNECTION_STRING and DATABASE_URL
    var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Convert postgres:// URL format → Npgsql connection string
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':');

        connectionString =
            $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};" +
            $"Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true;";
    }

    if (!string.IsNullOrEmpty(connectionString))
    {
        builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
    }
}

// Register application + identity services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// Enable PII for debugging token validation
IdentityModelEventSource.ShowPII = true;

// Swagger setup
builder.Services.AddSwaggerGen();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application starting...");

// Global error handling middleware
app.UseMiddleware<ExceptionMiddleware>();

// Configure CORS policy
if (app.Environment.IsDevelopment())
{
    app.UseCors(x => x
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:3000"));
}
else
{
    // For production: allow multiple origins via env
    var allowedOrigins = Environment
        .GetEnvironmentVariable("ALLOWED_ORIGINS")
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? new[] { "https://*.vercel.app" };

    app.UseCors(x => x
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins(allowedOrigins));
}

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Swagger UI setup
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Muzik API v1");
    c.RoutePrefix = string.Empty;
});

// Map controllers
app.MapControllers();

// Run migrations & seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var scopedLogger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<DataContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();

        await context.Database.MigrateAsync();

        await Seed.SeedPhotos(context);
        await Seed.SeedUsers(context, userManager, roleManager);
        await Seed.SeedGenres(context);
        await Seed.SeedSongs(context);
        await Seed.SeedAlbums(context);
        await Seed.SeedPlaylists(context);

        scopedLogger.LogInformation("Database migration and seeding completed successfully.");
    }
    catch (Exception ex)
    {
        scopedLogger.LogError(ex, "An error occurred during migration or seeding.");
    }
}

app.Run();
