namespace Muzik.DTOs.Playlists;

public class NewPlaylistDto
{
   public required string PlaylistName { get; set; }
   public string? Description { get; set; }
}