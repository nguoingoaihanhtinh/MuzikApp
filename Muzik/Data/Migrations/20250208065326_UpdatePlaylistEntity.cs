using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Muzik.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlaylistEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Playlists",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Playlists");
        }
    }
}
