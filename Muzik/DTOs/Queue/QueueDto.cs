using Muzik.DTOs.Songs;

namespace Muzik.DTOs.Queue;

public class QueueDto
{
    public SongDto? Current { get; set; }
    public List<SongDto> Upcoming { get; set; } = [];
}
