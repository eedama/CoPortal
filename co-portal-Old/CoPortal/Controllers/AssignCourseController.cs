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

namespace CoPortal.Controllers
{
    public class AssignCourseController : Controller
    {
        private PortalContext db = new PortalContext();

        // GET: AssignCourse
        public ActionResult Index()
        {
            var assignCourses = db.AssignCourses.Include(a => a.Course).Include(a => a.Lecturer);
            return View(assignCourses.ToList());
        }

        // GET: AssignCourse/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AssignCourse assignCourse = db.AssignCourses.Find(id);
            if (assignCourse == null)
            {
                return HttpNotFound();
            }
            return View(assignCourse);
        }

        // GET: AssignCourse/Create
        public ActionResult Create()
        {
            ViewBag.CourseID = new SelectList(db.Courses, "Id", "Name");
            ViewBag.LecturerID = new SelectList(db.Lecturers, "Id", "LecturerNumber");
            return View();
        }

        // POST: AssignCourse/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,CourseID,LecturerID")] AssignCourse assignCourse)
        {
            if (ModelState.IsValid)
            {
                db.AssignCourses.Add(assignCourse);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CourseID = new SelectList(db.Courses, "Id", "Name", assignCourse.CourseID);
            ViewBag.LecturerID = new SelectList(db.Lecturers, "Id", "LecturerNumber", assignCourse.LecturerID);
            return View(assignCourse);
        }

        // GET: AssignCourse/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AssignCourse assignCourse = db.AssignCourses.Find(id);
            if (assignCourse == null)
            {
                return HttpNotFound();
            }
            ViewBag.CourseID = new SelectList(db.Courses, "Id", "Name", assignCourse.CourseID);
            ViewBag.LecturerID = new SelectList(db.Lecturers, "Id", "LecturerNumber", assignCourse.LecturerID);
            return View(assignCourse);
        }

        // POST: AssignCourse/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,CourseID,LecturerID")] AssignCourse assignCourse)
        {
            if (ModelState.IsValid)
            {
                db.Entry(assignCourse).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CourseID = new SelectList(db.Courses, "Id", "Name", assignCourse.CourseID);
            ViewBag.LecturerID = new SelectList(db.Lecturers, "Id", "LecturerNumber", assignCourse.LecturerID);
            return View(assignCourse);
        }

        // GET: AssignCourse/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AssignCourse assignCourse = db.AssignCourses.Find(id);
            if (assignCourse == null)
            {
                return HttpNotFound();
            }
            return View(assignCourse);
        }

        // POST: AssignCourse/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            AssignCourse assignCourse = db.AssignCourses.Find(id);
            db.AssignCourses.Remove(assignCourse);
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
