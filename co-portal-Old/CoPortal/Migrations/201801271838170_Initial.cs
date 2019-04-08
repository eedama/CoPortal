namespace CoPortal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Admin",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Surname = c.String(),
                        AdminNumber = c.String(),
                        Email = c.String(),
                        Password = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AssignCourse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseID = c.Int(nullable: false),
                        LecturerID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseID, cascadeDelete: true)
                .ForeignKey("dbo.Lecturer", t => t.LecturerID, cascadeDelete: true)
                .Index(t => t.CourseID)
                .Index(t => t.LecturerID);
            
            CreateTable(
                "dbo.Course",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Code = c.String(),
                        Description = c.String(),
                        StartDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AssigmentQuestion",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        QuestionPdf = c.String(),
                        AssignmentType = c.Int(nullable: false),
                        Course_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.Course_Id)
                .Index(t => t.Course_Id);
            
            CreateTable(
                "dbo.Assignment",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DateSubmitted = c.DateTime(nullable: false),
                        Mark = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SubmittedPdf = c.String(),
                        AssigmentQuestion_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AssigmentQuestion", t => t.AssigmentQuestion_Id)
                .Index(t => t.AssigmentQuestion_Id);
            
            CreateTable(
                "dbo.LectureNote",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseID = c.Int(nullable: false),
                        LectureDate = c.DateTime(nullable: false),
                        PdfLectureNote = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseID, cascadeDelete: true)
                .Index(t => t.CourseID);
            
            CreateTable(
                "dbo.Message",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MessageContent = c.String(),
                        MessageDate = c.DateTime(nullable: false),
                        Course_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.Course_Id)
                .Index(t => t.Course_Id);
            
            CreateTable(
                "dbo.Enrollment",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseID = c.Int(nullable: false),
                        StudentID = c.Int(nullable: false),
                        FeesPaid = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseID, cascadeDelete: true)
                .ForeignKey("dbo.Student", t => t.StudentID, cascadeDelete: true)
                .Index(t => t.CourseID)
                .Index(t => t.StudentID);
            
            CreateTable(
                "dbo.Student",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Surname = c.String(),
                        Email = c.String(),
                        StudentNumber = c.String(),
                        Password = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Lecturer",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Surname = c.String(),
                        Email = c.String(),
                        Password = c.String(),
                        LecturerNumber = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AssignCourse", "LecturerID", "dbo.Lecturer");
            DropForeignKey("dbo.AssignCourse", "CourseID", "dbo.Course");
            DropForeignKey("dbo.Enrollment", "StudentID", "dbo.Student");
            DropForeignKey("dbo.Enrollment", "CourseID", "dbo.Course");
            DropForeignKey("dbo.Message", "Course_Id", "dbo.Course");
            DropForeignKey("dbo.LectureNote", "CourseID", "dbo.Course");
            DropForeignKey("dbo.AssigmentQuestion", "Course_Id", "dbo.Course");
            DropForeignKey("dbo.Assignment", "AssigmentQuestion_Id", "dbo.AssigmentQuestion");
            DropIndex("dbo.Enrollment", new[] { "StudentID" });
            DropIndex("dbo.Enrollment", new[] { "CourseID" });
            DropIndex("dbo.Message", new[] { "Course_Id" });
            DropIndex("dbo.LectureNote", new[] { "CourseID" });
            DropIndex("dbo.Assignment", new[] { "AssigmentQuestion_Id" });
            DropIndex("dbo.AssigmentQuestion", new[] { "Course_Id" });
            DropIndex("dbo.AssignCourse", new[] { "LecturerID" });
            DropIndex("dbo.AssignCourse", new[] { "CourseID" });
            DropTable("dbo.Lecturer");
            DropTable("dbo.Student");
            DropTable("dbo.Enrollment");
            DropTable("dbo.Message");
            DropTable("dbo.LectureNote");
            DropTable("dbo.Assignment");
            DropTable("dbo.AssigmentQuestion");
            DropTable("dbo.Course");
            DropTable("dbo.AssignCourse");
            DropTable("dbo.Admin");
        }
    }
}
