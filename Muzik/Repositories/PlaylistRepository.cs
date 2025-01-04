using Muzik.Data;
using Muzik.DTOs.Playlists;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class PlaylistRepository(DataContext context, IMapper mapper) : IPlaylistRepository
{
   public async Task<Playlist> CreatePlaylistAsync(NewPlaylistDto newPlaylistDto)
   {
      var playlist = mapper.Map<Playlist>(newPlaylistDto);

      await context.Playlists.AddAsync(playlist);
      await context.SaveChangesAsync();

      return playlist;
   }

   public Task<Playlist?> GetPlaylistByIdAsync(int id)
   {
      return context.Playlists
         .Include(p => p.Songs).ThenInclude(ps => ps.Song).ThenInclude(s => s.Photos).ThenInclude(sp => sp.Photo)
         .FirstOrDefaultAsync(p => p.Id == id);
   }

   public async Task<bool> SaveChangesAsync()
   {
      return await context.SaveChangesAsync() > 0;
   }
}
