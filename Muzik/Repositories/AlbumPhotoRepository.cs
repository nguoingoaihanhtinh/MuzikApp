using Muzik.Data;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class AlbumPhotoRepository(DataContext context) : IAlbumPhotoRepository
{
    public void AddAlbumPhoto(AlbumPhoto albumPhoto)
    {
        context.AlbumPhotos.Add(albumPhoto);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
