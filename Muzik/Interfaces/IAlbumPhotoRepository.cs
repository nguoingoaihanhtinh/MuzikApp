using Muzik.Entities;

namespace Muzik.Interfaces;

public interface IAlbumPhotoRepository
{
    void AddAlbumPhoto(AlbumPhoto albumPhoto);
    Task<bool> SaveChangesAsync();
}
