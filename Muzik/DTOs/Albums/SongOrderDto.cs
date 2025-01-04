using Muzik.DTOs.Songs;

namespace Muzik.DTOs.Albums;

public class SongOrderDto
{
    public SongDto? Song { get; set; }
    public int Order { get; set; }
}