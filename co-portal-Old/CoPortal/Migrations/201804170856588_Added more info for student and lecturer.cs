namespace CoPortal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addedmoreinfoforstudentandlecturer : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Student", "IdNumber", c => c.String(maxLength: 13));
            AddColumn("dbo.Lecturer", "IdNumber", c => c.String(maxLength: 13));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Lecturer", "IdNumber");
            DropColumn("dbo.Student", "IdNumber");
        }
    }
}
