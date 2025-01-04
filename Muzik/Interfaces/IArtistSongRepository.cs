using Muzik.Entities;
namespace Muzik.Interfaces;

public interface IArtistSongRepository
{
   void AddArtistSong(ArtistSong artistSong);
   Task<List<ArtistSong>?> GetArtistSongsAsync(int songId);
   void RemoveArtistSong(ArtistSong artistSong);
   Task<bool> SaveChangesAsync();
}
