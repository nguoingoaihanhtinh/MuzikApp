using Muzik.DTOs.Genres;
using Muzik.Entities;
using Muzik.Helpers;

namespace Muzik.Interfaces;

public interface IGenreRepository
{
   Task<Genre?> GetGenreByIdAsync(int id);
   Task<Genre?> GetGenreByNameAsync(string name);
   Task<PagedList<GenreDto>> GetGenresAsync(PaginationParams paginationParams);
   Task<Genre> AddGenreAsync(Genre genre);
   Task<bool> DeleteGenreAsync(int id);
   Task<bool> SaveChangesAsync();
   void AddGenre(Genre genre);
   Task<IEnumerable<GenreDto>> GetAllGenresAsync();
}
