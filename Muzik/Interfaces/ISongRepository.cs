using Muzik.DTOs.Songs;
using Muzik.Entities;
using Muzik.Helpers;

namespace Muzik.Interfaces;

public interface ISongRepository
{
    Task<Song?> GetSongByIdAsync(int id);
    Task<Song> AddSongAsync(NewSongDto newSongDto);
    void RemoveSong(Song song);
    Task<PagedList<SongDto>> GetSongsAsync(SongParams songParams);
    Task<bool> SaveChangesAsync();
}
