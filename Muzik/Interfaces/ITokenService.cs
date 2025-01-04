using Muzik.Entities;

namespace Muzik.Interfaces;

public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
}
