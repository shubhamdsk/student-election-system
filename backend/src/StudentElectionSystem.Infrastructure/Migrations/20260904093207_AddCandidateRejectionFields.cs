using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentElectionSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateRejectionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "Candidates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "RejectedAt",
                table: "Candidates",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Candidates",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "RejectedAt",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Candidates");
        }
    }
}
