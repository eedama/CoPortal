using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CoPortal.DAL;
using CoPortal.Models;
using CoPortal.Helpers;
using CoPortal.Login;

namespace CoPortal.Controllers
{
    public class StudentController : Controller
    {
        private PortalContext db = new PortalContext();

        // GET: Student
        public ActionResult Index()
        {
            if (HttpContextHelper.SessionUserId != 0 && HttpContextHelper.Session == "STUDENT")
            {
                return RedirectToAction("DetailsStudent", new { id = HttpContextHelper.SessionUserId });
            }

            return View(db.Students.ToList());
        }

        // GET: Student/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return HttpNotFound();
            }

            IQueryable<Enrollment> enrollments = db.Enrollments.Where(x => x.StudentID == id.Value);

            foreach (var enrollment in enrollments)
            {
                student.CourseEnrollments.Add(enrollment);
            }
            return View(student);
        }

        public ActionResult DetailsStudent(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return HttpNotFound();
            }

            IQueryable<Enrollment> enrollments = db.Enrollments.Where(x => x.StudentID == id.Value);

            foreach (var enrollment in enrollments)
            {
                student.CourseEnrollments.Add(enrollment);
            }
            return View(student);
        }

        public ActionResult CourseDetails(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            return RedirectToAction("details", "Course", new { id = id });

        }

        // GET: Student/Create
        public ActionResult Create()
        {
            Student s = db.Students.FirstOrDefault(p => p.Id == db.Students.Max(x => x.Id));
            var newstudentNumber = AccountNumber.NextStudentNumber(s.StudentNumber);
            var student = new Student { StudentNumber = newstudentNumber, Password = newstudentNumber };
            return View(student);
        }

        // POST: Student/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Surname,Email,StudentNumber,IdNumber,Password")] Student student)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(student.Password))
                {
                    var password = PasswordHelper.Hash(student.Password);
                    student.Password = student.IdNumber;
                    db.Students.Add(student);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }

            return View(student);
        }

        // GET: Student/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return HttpNotFound();
            }
            return View(student);
        }

        // POST: Student/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Surname,Email")] Student student)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(student.Password))
                {
                    var s = new Student { Id = student.Id, Name = student.Name, Surname = student.Surname };
                    db.Students.Attach(s);
                    db.Entry(s).Property(x => x.Name).IsModified = true;
                    db.Entry(s).Property(x => x.Surname).IsModified = true;
                    db.Entry(s).Property(x => x.Email).IsModified = true;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return View(student);
        }

        public ActionResult EditStudent(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return HttpNotFound();
            }
            return View(student);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditStudent([Bind(Include = "Id,Name,Surname,Email")] Student student)
        {
            if (ModelState.IsValid)
            {
                var s = new Student { Id = student.Id, Name = student.Name, Surname = student.Surname };
                db.Students.Attach(s);
                db.Entry(s).Property(x => x.Name).IsModified = true;
                db.Entry(s).Property(x => x.Surname).IsModified = true;
                db.Entry(s).Property(x => x.Email).IsModified = true;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(student);
        }

        // GET: Student/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return HttpNotFound();
            }
            return View(student);
        }

        // POST: Student/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Student student = db.Students.Find(id);
            db.Students.Remove(student);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
