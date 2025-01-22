using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Muzik.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAppUserIdFromPlaylists : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_AspNetUsers_PublisherId",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_PublisherId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                table: "Playlists");

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Playlists",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_AppUserId",
                table: "Playlists",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_AspNetUsers_AppUserId",
                table: "Playlists",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_AspNetUsers_AppUserId",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_AppUserId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Playlists");

            migrationBuilder.AddColumn<int>(
                name: "PublisherId",
                table: "Playlists",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_PublisherId",
                table: "Playlists",
                column: "PublisherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_AspNetUsers_PublisherId",
                table: "Playlists",
                column: "PublisherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
