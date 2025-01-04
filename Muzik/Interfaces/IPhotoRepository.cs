using Muzik.Entities;

namespace Muzik.Interfaces;

public interface IPhotoRepository
{
    Task<Photo> AddPhotoAsync(Photo photo);
    Task<Photo?> GetPhotoByIdAsync(int photoId);
    void RemovePhoto(Photo photo);
    Task<bool> SaveChangesAsync();
}
