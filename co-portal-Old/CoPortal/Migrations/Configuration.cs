namespace CoPortal.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using CoPortal.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<CoPortal.DAL.PortalContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(CoPortal.DAL.PortalContext context)
        {
            var students = new List<Student>
            {
                new Student{Name = "John", Surname = "Smith", Email = "Student0@gmail.com", StudentNumber = "2017S00001",IdNumber = "8909056037087", Password = "8909056037087"}
            };

            students.ForEach(s => context.Students.Add(s));
            context.SaveChanges();
            
            var courses = new List<Course>
            {
                new Course{Name = "Course1", Code="Course0", StartDate = DateTime.Parse("2017-10-01"),Description="This is a Test Course"}
            };
            courses.ForEach(s => context.Courses.Add(s));
            context.SaveChanges();
            
            var enrollments = new List<Enrollment>
            {
                new Enrollment{StudentID = 1, CourseID = 1, FeesPaid=true}
            };

            enrollments.ForEach(s => context.Enrollments.Add(s));
            context.SaveChanges();
            
            var admins = new List<Admin>
            {
                new Admin{AdminNumber = "2017A0001", Email = "Admin@gmail.com", Name = "Admin0", Surname = "Admin0Surname", Password = "8BE3C943B1609FFFBFC51AAD666D0A04ADF83C9D"}
            };

            admins.ForEach(s => context.Admins.Add(s));
            context.SaveChanges();
            
            var lecturers = new List<Lecturer>
            {
                new Lecturer{LecturerNumber = "2017L0001", Email = "Lecturer@gmail.com", Name = "David", Surname = "Black",IdNumber = "5209056037087", Password = "5209056037087"}
            };

            lecturers.ForEach(s => context.Lecturers.Add(s));
            context.SaveChanges();

            var assignCourses = new List<AssignCourse>
            {
                new AssignCourse{CourseID=1, LecturerID = 1}
            };
            assignCourses.ForEach(s => context.AssignCourses.Add(s));
            context.SaveChanges();

            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
        }
    }
}
