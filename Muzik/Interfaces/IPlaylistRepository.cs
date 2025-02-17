using Muzik.Entities;
using Muzik.DTOs.Playlists;

namespace Muzik.Interfaces;

public interface IPlaylistRepository
{
   Task<Playlist> CreatePlaylistAsync(NewPlaylistDto newPlaylistDto);
   Task<Playlist?> GetPlaylistByIdAsync(int id);
   Task<bool> SaveChangesAsync();
   Task<IEnumerable<Playlist>> GetPlaylistsByUserIdAsync(int userId); 
   Task<bool> DeletePlaylistAsync(int id);
}
