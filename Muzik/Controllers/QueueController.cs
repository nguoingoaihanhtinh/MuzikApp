using Muzik.DTOs.Queue;
using Muzik.Extensions;
using Muzik.Interfaces;

namespace Muzik.Controllers;

[Authorize]
public class QueueController(IQueueService queueService, ISongRepository songRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<QueueDto>> GetQueue(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var dto = await queueService.GetQueueAsync(userId, ct);
        return Ok(dto);
    }

    [HttpPost("add")]
    public async Task<ActionResult<QueueDto>> AddToQueue([FromBody] AddToQueueDto request, CancellationToken ct)
    {
        if (request == null || request.SongId <= 0)
            return BadRequest("Invalid payload");

        var song = await songRepository.GetSongByIdAsync(request.SongId);
        if (song is null)
            return NotFound("Song not found");

        var userId = User.GetUserId();
        var dto = await queueService.AddToQueueAsync(userId, request.SongId, ct);
        return Ok(dto);
    }

    [HttpPost("advance")]
    public async Task<ActionResult<QueueDto>> Advance(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var dto = await queueService.AdvanceAsync(userId, ct);
        return Ok(dto);
    }
}
