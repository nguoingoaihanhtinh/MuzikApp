namespace Muzik.DTOs.Genres;

public class AddUpdateGenreDto
{
    [Required]
    public required string GenreName { get; set; }
}