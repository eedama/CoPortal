using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoPortal.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace CoPortal.DAL
{
    public class PortalContext : DbContext
    {
        public PortalContext() : base("PortalContext")
        {
        }
        
        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AssigmentQuestion> AssignmentQuestions { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<LectureNote> LectureNotes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<AssignCourse> AssignCourses { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<PortalContext>(null);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }

    }
}