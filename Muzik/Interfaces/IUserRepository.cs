using Muzik.DTOs.Users;
using Muzik.Entities;
using Muzik.Helpers;

namespace Muzik.Interfaces;

public interface IUserRepository
{
    Task<IdentityResult> ChangePasswordAsync(AppUser user, ChangePasswordDto changePasswordDto);
    Task<bool> CheckPasswordAsync(AppUser user, string password);
    Task<IdentityResult> CreateUserAsync(RegisterDto registerDto);
    Task<PagedList<UserDto>> GetArtistsAsync(UserParams userParams);
    Task<AppUser?> GetUserByEmailAsync(string email);
    Task<AppUser?> GetUserByIdAsync(int id);
    Task<PagedList<UserDto>> GetUsersAsync(UserParams userParams);
}
