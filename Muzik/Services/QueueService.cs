using Muzik.DTOs.Queue;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Services;

public class QueueService(IQueueRepository queueRepository, ISongRepository songRepository, IMapper mapper) : IQueueService
{
    public async Task<QueueDto> GetQueueAsync(int userId, CancellationToken ct = default)
    {
        var items = await queueRepository.GetUserQueueAsync(userId, ct);
        var songs = new List<DTOs.Songs.SongDto>();
        foreach (var item in items.OrderBy(i => i.Position))
        {
            var song = await songRepository.GetSongByIdAsync(item.SongId);
            if (song != null)
            {
                songs.Add(mapper.Map<DTOs.Songs.SongDto>(song));
            }
        }

        return new QueueDto
        {
            Current = songs.FirstOrDefault(),
            Upcoming = songs.Skip(1).ToList()
        };
    }

    public async Task<QueueDto> AddToQueueAsync(int userId, int songId, CancellationToken ct = default)
    {
        var existing = await queueRepository.GetUserQueueAsync(userId, ct);
        var nextPosition = existing.Count == 0 ? 0 : existing.Max(i => i.Position) + 1;

        var item = new QueueItem
        {
            UserId = userId,
            SongId = songId,
            Position = nextPosition,
            AddedAt = DateTime.UtcNow
        };

        await queueRepository.AddAsync(item, ct);
        await queueRepository.SaveChangesAsync(ct);
        return await GetQueueAsync(userId, ct);
    }
}
