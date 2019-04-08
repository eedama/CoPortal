namespace CoPortal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddedAnnouncementsmodel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
            "dbo.Announcement",
            c => new
            {
                Id = c.Int(nullable: false, identity: true),
                LecturerId = c.Int(nullable: false),
                StudentId = c.Int(nullable: false),
                DateSent = c.DateTimeOffset(nullable:false),
                Message = c.String()
            })
            .PrimaryKey(t => t.Id)
            .ForeignKey("dbo.Lecturer", t => t.LecturerId, cascadeDelete: true)
            .ForeignKey("dbo.Student", t => t.StudentId, cascadeDelete: true)
            .Index(t => t.LecturerId)
            .Index(t => t.StudentId);

        }

        public override void Down()
        {
            DropForeignKey("dbo.Announcement", "LecturerId", "dbo.Lecturer");
            DropForeignKey("dbo.Announcement", "StudentId", "dbo.Student");
            DropIndex("dbo.Announcement", new[] { "LecturerId" });
            DropIndex("dbo.Announcement", new[] { "StudentId" });
            DropTable("dbo.Announcement");
        }
    }
}
