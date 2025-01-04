using Muzik.Entities;

namespace Muzik.Interfaces;

public interface ISongGenreRepository
{
   void AddSongGenre(SongGenre songGenre);
   Task<List<SongGenre>?> GetSongGenresAsync(int songId);
   void RemoveSongGenre(SongGenre songGenre);
   Task<bool> SaveChangesAsync();
}
