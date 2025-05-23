using Muzik.DTOs.Albums;
using Muzik.DTOs.Playlists;
using Muzik.Entities;
using Muzik.Extensions;
using Muzik.Interfaces;

namespace Muzik.Controllers;

public class PlaylistsController(
   IPlaylistRepository PlaylistRepository,
   IPlaylistSongRepository playlistSongRepository,
   ISongRepository songRepository,
   IMapper mapper
) : BaseApiController
{
   [HttpGet("{id:int}")]
   public async Task<ActionResult<PlaylistDto>> GetPlaylistById(int id)
   {
      var playlist = await PlaylistRepository.GetPlaylistByIdAsync(id);
      if (playlist == null)
      {
         return NotFound("You don't have any playlists. yet!");
      }

      return mapper.Map<PlaylistDto>(playlist);
   }
   [HttpGet("my")]
   [Authorize(Roles = "Listener, Artist")]
   public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetMyPlaylists()
   {
      var userId = User.GetUserId(); // Lấy userId từ token

      var playlists = await PlaylistRepository.GetPlaylistsByUserIdAsync(userId);
      if (playlists == null || !playlists.Any())
      {
         return NotFound("You don't have any playlists.");
      }

      return Ok(mapper.Map<IEnumerable<PlaylistDto>>(playlists));
   }

   [HttpPost]
   // [Authorize(Roles = "Listener, Artist")]
   public async Task<ActionResult<PlaylistDto>> CreatePlaylist([FromForm] NewPlaylistDto newPlaylistDto)
   {
      if (newPlaylistDto == null)
      {
         return BadRequest("Invalid playlist data.");
      }
      var userId = User.GetUserId();
      newPlaylistDto.UserId = userId;
      var playlist = await PlaylistRepository.CreatePlaylistAsync(newPlaylistDto);

      return mapper.Map<PlaylistDto>(playlist);
   }

   [HttpPut("add-song/{id:int}")]
   [Authorize(Roles = "Listener, Artist")]
   public async Task<ActionResult<PlaylistDto>> AddSongToPlaylist(int id, AddRemovePlaylistSongDto addRemovePlaylistSongDto)
   {
      var playlist = await PlaylistRepository.GetPlaylistByIdAsync(id);
      if (playlist == null)
      {
         return NotFound("Playlist not found.");
      }

      var song = await songRepository.GetSongByIdAsync(addRemovePlaylistSongDto.SongId);
      if (song == null)
      {
         return NotFound("Song not found.");
      }

      var playlistSong = await playlistSongRepository.GetPlaylistSongAsync(id, song.Id);
      if (playlistSong != null)
      {
         return BadRequest("Song already exists in the playlist.");
      }

      playlistSongRepository.AddPlaylistSong(new PlaylistSong
      {
         PlaylistId = playlist.Id,
         SongId = song.Id
      });

      if (await playlistSongRepository.SaveChangesAsync())
      {
         return mapper.Map<PlaylistDto>(playlist);
      }

      return BadRequest("Failed to add song to playlist.");
   }

   [HttpPut("remove-song/{id:int}")]
   [Authorize(Roles = "Listener, Artist")]
   public async Task<ActionResult<PlaylistDto>> RemoveSongFromPlaylist(int id, AddRemovePlaylistSongDto addRemovePlaylistSongDto)
   {
      var playlist = await PlaylistRepository.GetPlaylistByIdAsync(id);
      if (playlist == null)
      {
         return NotFound("Playlist not found.");
      }

      var song = await songRepository.GetSongByIdAsync(addRemovePlaylistSongDto.SongId);
      if (song == null)
      {
         return NotFound("Song not found.");
      }

      var playlistSong = await playlistSongRepository.GetPlaylistSongAsync(id, song.Id);
      if (playlistSong == null)
      {
         return BadRequest("Song does not exist in the playlist.");
      }

      playlistSongRepository.RemovePlaylistSong(playlistSong);

      if (await playlistSongRepository.SaveChangesAsync())
      {
         return mapper.Map<PlaylistDto>(playlist);
      }

      return BadRequest("Failed to remove song from playlist.");
   }

   [HttpDelete("{id:int}")]
   [Authorize(Roles = "Listener, Artist")]
   public async Task<IActionResult> DeletePlaylist(int id)
   {
      var userId = User.GetUserId();
      var playlist = await PlaylistRepository.GetPlaylistByIdAsync(id);

      if (playlist == null)
      {
         return NotFound("Playlist not found.");
      }

      if (playlist.UserId != userId) 
      {
         return Forbid();
      }

      var success = await PlaylistRepository.DeletePlaylistAsync(id);
      if (!success)
      {
         return BadRequest("Failed to delete playlist.");
      }

      return NoContent(); 
   }

}
