using Muzik.DTOs.Songs;
using Muzik.Entities;

namespace Muzik.DTOs.Playlists;

public class PlaylistDto
{
   public int Id { get; set; }
   public required string PlaylistName { get; set; }
   public string? Description { get; set; }
   public int TotalListeningHours { get; set; }
   public int TotalSongs { get; set; }
   public DateTime CreatedAt { get; set; }
   public List<SongDto>? Songs { get; set; }
   public string? BackgroundImageUrl { get; set; }
   public string? PlaylistImageUrl { get; set; }
}