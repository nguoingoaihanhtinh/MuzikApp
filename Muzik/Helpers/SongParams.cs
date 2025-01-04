namespace Muzik.Helpers;

public class SongParams : PaginationParams
{
   public string? SongName { get; set; }
   public string? Artist { get; set; }
   public string? OrderBy { get; set; } = "songName";
   public string? SortBy { get; set; } = "asc";

}
