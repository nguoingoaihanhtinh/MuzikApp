namespace Muzik.Entities;

public class QueueItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SongId { get; set; }
    public int Position { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
