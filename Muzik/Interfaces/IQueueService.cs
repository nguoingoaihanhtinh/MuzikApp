using Muzik.DTOs.Queue;

namespace Muzik.Interfaces;

public interface IQueueService
{
    Task<QueueDto> GetQueueAsync(int userId, CancellationToken ct = default);
    Task<QueueDto> AddToQueueAsync(int userId, int songId, CancellationToken ct = default);
    Task<QueueDto> AdvanceAsync(int userId, CancellationToken ct = default);
}
