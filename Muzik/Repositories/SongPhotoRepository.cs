

using Muzik.Data;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class SongPhotoRepository(DataContext context) : ISongPhotoRepository
{
   public void AddSongPhoto(SongPhoto songPhoto)
   {
      context.SongPhotos.Add(songPhoto);
   }

   public async Task<List<SongPhoto>?> GetSongPhotoAsync(int songId)
   {
      return await context.SongPhotos
            .Where(sp => sp.SongId == songId)
            .ToListAsync();
   }

   public void RemoveSongPhoto(SongPhoto songPhoto)
   {
      context.SongPhotos.Remove(songPhoto);
   }

   public async Task<bool> SaveChangesAsync()
   {
      return await context.SaveChangesAsync() > 0;
   }
}
