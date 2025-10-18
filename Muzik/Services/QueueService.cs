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

    public async Task<QueueDto> AdvanceAsync(int userId, CancellationToken ct = default)
    {
        var items = await queueRepository.GetUserQueueAsync(userId, ct);
        if (items.Count == 0)
        {
            // Nothing to advance
            return await GetQueueAsync(userId, ct);
        }

        // Remove the current (position 0) by Id and shift others up
        var current = items.OrderBy(i => i.Position).First();
        await queueRepository.RemoveByIdAsync(current.Id, ct);

        var remaining = items.Where(i => i.SongId != current.SongId)
            .OrderBy(i => i.Position).ToList();
        for (var idx = 0; idx < remaining.Count; idx++)
        {
            remaining[idx].Position = idx;
        }
        await queueRepository.SaveChangesAsync(ct);
        return await GetQueueAsync(userId, ct);
    }
}
