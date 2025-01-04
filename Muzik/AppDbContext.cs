using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Muzik.DTOs.Artists;
using Muzik.DTOs.Genres;
using Muzik.DTOs.Songs;
using Muzik.DTOs.Users;

namespace Muzik.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet properties for each entity
        public DbSet<SongDto> Songs { get; set; }
        public DbSet<GenreDto> Genres { get; set; }
        public DbSet<ArtistDto> Artists { get; set; }
        public DbSet<UserDto> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<SongDto>()
                .HasMany(s => s.Artists)
                .WithMany()
                .UsingEntity(j => j.ToTable("SongArtists"));

            modelBuilder.Entity<SongDto>()
                .Property(s => s.Genres)
                .HasConversion(
                    g => string.Join(',', g), 
                    g => g.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() 
                );
        }
    }
}
