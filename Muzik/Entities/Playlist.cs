namespace Muzik.Entities;

public class Playlist
{
    public int Id { get; set; }
    public required string PlaylistName { get; set; }
    public required string Description { get; set; }
    public int TotalListeningHours { get; set; } = 0;
    public int TotalSongs { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    public List<PlaylistSong> Songs { get; set; } = [];


}