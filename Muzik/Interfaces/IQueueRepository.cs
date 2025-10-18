namespace Muzik.Interfaces;

using Muzik.Entities;

public interface IQueueRepository
{
    Task<List<QueueItem>> GetUserQueueAsync(int userId, CancellationToken ct = default);
    Task AddAsync(QueueItem item, CancellationToken ct = default);
    Task RemoveAsync(int userId, int songId, CancellationToken ct = default);
    Task ReorderAsync(int userId, IReadOnlyList<int> orderedSongIds, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
