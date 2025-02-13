namespace Muzik.DTOs.Playlists;

public class NewPlaylistDto
{
   public required string PlaylistName { get; set; }
   public string? Description { get; set; }
   public int UserId {get; set;}
    public string? BackgroundImageUrl { get; set; }
    public string? PlaylistImageUrl { get; set; }
}