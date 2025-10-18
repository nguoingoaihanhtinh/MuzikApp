using Microsoft.EntityFrameworkCore;
using Muzik.Data;
using Muzik.Entities;
using Muzik.Interfaces;

namespace Muzik.Repositories;

public class QueueRepository(DataContext context) : IQueueRepository
{
    private readonly DataContext _context = context;

    public async Task<List<QueueItem>> GetUserQueueAsync(int userId, CancellationToken ct = default)
    {
        return await _context.QueueItems
            .Where(q => q.UserId == userId)
            .OrderBy(q => q.Position)
            .ToListAsync(ct);
    }

    public async Task AddAsync(QueueItem item, CancellationToken ct = default)
    {
        await _context.QueueItems.AddAsync(item, ct);
    }

    public async Task RemoveAsync(int userId, int songId, CancellationToken ct = default)
    {
        var entity = await _context.QueueItems
            .FirstOrDefaultAsync(q => q.UserId == userId && q.SongId == songId, ct);
        if (entity is not null)
        {
            _context.QueueItems.Remove(entity);
        }
    }

    public async Task ReorderAsync(int userId, IReadOnlyList<int> orderedSongIds, CancellationToken ct = default)
    {
        var existing = await _context.QueueItems
            .Where(q => q.UserId == userId)
            .ToListAsync(ct);

        var position = 0;
        foreach (var songId in orderedSongIds)
        {
            var item = existing.FirstOrDefault(x => x.SongId == songId);
            if (item is not null)
            {
                item.Position = position++;
            }
        }
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _context.SaveChangesAsync(ct);
}
