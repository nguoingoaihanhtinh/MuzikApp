using Muzik.Entities;
using Muzik.DTOs.Playlists;

namespace Muzik.Interfaces;

public interface IPlaylistRepository
{
   Task<Playlist> CreatePlaylistAsync(NewPlaylistDto newPlaylistDto);
   Task<Playlist?> GetPlaylistByIdAsync(int id);
   Task<bool> SaveChangesAsync();
}
