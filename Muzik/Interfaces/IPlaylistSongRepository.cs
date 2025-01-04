using Muzik.Entities;

namespace Muzik.Interfaces;

public interface IPlaylistSongRepository
{
   void AddPlaylistSong(PlaylistSong playlistSong);
   Task<PlaylistSong?> GetPlaylistSongAsync(int playlistId, int songId);
   Task<List<PlaylistSong>> GetPlaylistSongsAsync(int playlistId);
   void RemovePlaylistSong(PlaylistSong playlistSong);
   Task<bool> SaveChangesAsync();
}
