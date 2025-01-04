using Muzik.DTOs.Albums;
using Muzik.Entities;
using Muzik.Helpers;

namespace Muzik.Interfaces;

public interface IAlbumRepository
{
    Task<Album> CreateAlbumAsync(NewAlbumDto newAlbumDto);
    Task<Album?> GetAlbumByIdAsync(int id);
    Task<PagedList<AlbumDto>> GetAlbumsAsync(AlbumParams albumParams);
    Task<bool> SaveChangesAsync();
}
