using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Muzik.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPlaylistImageUrls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackgroundImageUrl",
                table: "Playlists",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlaylistImageUrl",
                table: "Playlists",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundImageUrl",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "PlaylistImageUrl",
                table: "Playlists");
        }
    }
}
