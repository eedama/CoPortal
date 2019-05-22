namespace CoPortal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedCourseIDonannouncements : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Announcement", "CourseId", c => c.Int(nullable: false));
            CreateIndex("dbo.Announcement", "CourseId");
            AddForeignKey("dbo.Announcement", "CourseId", "dbo.Course", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Announcement", "CourseId", "dbo.Course");
            DropIndex("dbo.Announcement", new[] { "CourseId" });
            DropColumn("dbo.Announcement", "CourseId");
        }
    }
}
