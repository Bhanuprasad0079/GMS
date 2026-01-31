using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GrievanceAPI.Migrations
{
    /// <inheritdoc />
    public partial class RenameContactToEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contact",
                table: "Users",
                newName: "Email");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "Contact");
        }
    }
}
