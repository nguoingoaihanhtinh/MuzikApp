using Muzik.Data;
using Muzik.DTOs.Playlists;
using Muzik.Entities;
using Muzik.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Muzik.Repositories;

public class PlaylistRepository(DataContext context, IMapper mapper) : IPlaylistRepository
{
    public async Task<Playlist> CreatePlaylistAsync(NewPlaylistDto newPlaylistDto)
    {
        var playlist = mapper.Map<Playlist>(newPlaylistDto);
        playlist.CreatedAt = DateTime.UtcNow; // Gán thời gian tạo playlist

        await context.Playlists.AddAsync(playlist);
        await context.SaveChangesAsync();

        return playlist;
    }

    public async Task<Playlist?> GetPlaylistByIdAsync(int id)
    {
        return await context.Playlists
            .Include(p => p.Songs)
                .ThenInclude(ps => ps.Song)
                    .ThenInclude(s => s.Artists) 
                        .ThenInclude(sa => sa.Artist) 
            .Include(p => p.Songs)
                .ThenInclude(ps => ps.Song)
                    .ThenInclude(s => s.Photos) 
                     .ThenInclude(sp => sp.Photo) 
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }


   public async Task<IEnumerable<Playlist>> GetPlaylistsByUserIdAsync(int userId)
   {
      return await context.Playlists
         .Where(p => p.UserId == userId)
         .Include(p => p.Songs)
         .ThenInclude(ps => ps.Song)
         .ToListAsync();
   }


    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeletePlaylistAsync(int id)
    {
        var playlist = await context.Playlists
            .Include(p => p.Songs)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (playlist == null)
        {
            return false;
        }

        context.Playlists.Remove(playlist);
        return await context.SaveChangesAsync() > 0;
    }
}
