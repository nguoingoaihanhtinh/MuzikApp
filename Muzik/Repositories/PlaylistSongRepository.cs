using Muzik.Data;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class PlaylistSongRepository(DataContext context) : IPlaylistSongRepository
{
   public void AddPlaylistSong(PlaylistSong playlistSong)
   {
      context.PlaylistSongs.Add(playlistSong);
   }

   public async Task<PlaylistSong?> GetPlaylistSongAsync(int playlistId, int songId)
   {
      return await context.PlaylistSongs.FindAsync(playlistId, songId);
   }

   public Task<List<PlaylistSong>> GetPlaylistSongsAsync(int playlistId)
   {
      return context.PlaylistSongs
            .Where(x => x.PlaylistId == playlistId)
            .ToListAsync();
   }

   public void RemovePlaylistSong(PlaylistSong playlistSong)
   {
      context.PlaylistSongs.Remove(playlistSong);
   }

   public async Task<bool> SaveChangesAsync()
   {
      return await context.SaveChangesAsync() > 0;
   }
}
