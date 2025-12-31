using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingProject.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "OutboxMessages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "FeatureFlags",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Carts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CorrelationId",
                table: "AuditLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hash",
                table: "AuditLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousHash",
                table: "AuditLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RemoteIp",
                table: "AuditLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AuditLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserAgent",
                table: "AuditLogs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "OutboxMessages");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "FeatureFlags");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "CorrelationId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "Hash",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "PreviousHash",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "RemoteIp",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "UserAgent",
                table: "AuditLogs");
        }
    }
}
