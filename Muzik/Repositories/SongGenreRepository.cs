
using Muzik.Data;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class SongGenreRepository(DataContext context) : ISongGenreRepository
{
   public void AddSongGenre(SongGenre songGenre)
   {
      context.SongGenres.Add(songGenre);
   }

   public async Task<List<SongGenre>?> GetSongGenresAsync(int songId)
   {
      return await context.SongGenres
            .Where(sg => sg.SongId == songId)
            .ToListAsync();
   }

   public void RemoveSongGenre(SongGenre songGenre)
   {
      context.SongGenres.Remove(songGenre);
   }

   public async Task<bool> SaveChangesAsync()
   {
      return await context.SaveChangesAsync() > 0;
   }
}
