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
using System.IO;

namespace CoPortal.Controllers
{
    public class LecturerController : Controller
    {
        private PortalContext db = new PortalContext();

        // GET: Lecturer
        public ActionResult Index()
        {
            if (HttpContextHelper.SessionUserId != 0 && HttpContextHelper.Session == "LECTURER")
            {
                return RedirectToAction("detailsLecturer", new { id = HttpContextHelper.SessionUserId });
            }
            return View(db.Lecturers.ToList());
        }

        // GET: Lecturer/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lecturer lecturer = db.Lecturers.Find(id);
            if (lecturer == null)
            {
                return HttpNotFound();
            }
            return View(lecturer);
        }

        public ActionResult DetailsLecturer(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lecturer lecturer = db.Lecturers.Find(id);
            if (lecturer == null)
            {
                return HttpNotFound();
            }

            //New lines
            var assingedcourses = db.AssignCourses.Where(a => a.LecturerID == id).ToList();
            foreach (AssignCourse ac in assingedcourses) {
                lecturer.AssignedCourses.Add(ac);
            }
            //End
            return View(lecturer);
        }

        // GET: Lecturer/Create
        public ActionResult Create()
        {
            Lecturer l = db.Lecturers.FirstOrDefault(p => p.Id == db.Lecturers.Max(x => x.Id));
            var newLecturerNumber = AccountNumber.NextLecturerNumber(l.LecturerNumber);
            var admin = new Lecturer { LecturerNumber = newLecturerNumber, Password = newLecturerNumber };
            return View(admin);
        }

        // POST: Lecturer/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Surname,Email,Password,LecturerNumber,Idnumber")] Lecturer lecturer)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(lecturer.Password))
                {
                    var password = PasswordHelper.Hash(lecturer.Password);
                    lecturer.Password = lecturer.IdNumber;
                    db.Lecturers.Add(lecturer);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }

            return View(lecturer);
        }

        // GET: Lecturer/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lecturer lecturer = db.Lecturers.Find(id);
            if (lecturer == null)
            {
                return HttpNotFound();
            }
            return View(lecturer);
        }

        // POST: Lecturer/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Surname,Email,Password,LecturerNumber")] Lecturer lecturer)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(lecturer.Password))
                {
                    var l = new Lecturer { Id = lecturer.Id, Name = lecturer.Name, Surname = lecturer.Surname };
                    db.Lecturers.Attach(l);
                    db.Entry(l).Property(x => x.Name).IsModified = true;
                    db.Entry(l).Property(x => x.Surname).IsModified = true;
                    db.Entry(l).Property(x => x.Email).IsModified = true;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }  
            }
            return View(lecturer);
        }

        public ActionResult EditLecturer(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lecturer lecturer = db.Lecturers.Find(id);
            if (lecturer == null)
            {
                return HttpNotFound();
            }
            return View(lecturer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditLecturer([Bind(Include = "Id,Name,Surname,Email,Password,LecturerNumber")] Lecturer lecturer)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(lecturer.Password))
                {
                    var l = new Lecturer { Id = lecturer.Id, Name = lecturer.Name, Surname = lecturer.Surname };
                    db.Lecturers.Attach(l);
                    db.Entry(l).Property(x => x.Name).IsModified = true;
                    db.Entry(l).Property(x => x.Surname).IsModified = true;
                    db.Entry(l).Property(x => x.Email).IsModified = true;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return View(lecturer);
        }

        // GET: Lecturer/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lecturer lecturer = db.Lecturers.Find(id);
            if (lecturer == null)
            {
                return HttpNotFound();
            }
            return View(lecturer);
        }

        // POST: Lecturer/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Lecturer lecturer = db.Lecturers.Find(id);
            db.Lecturers.Remove(lecturer);
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

        //New method w/ new view:CourseDetails.cshtml
        public ActionResult CourseDetails(int? CourseId)
        {
            if (CourseId == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Course course = db.Courses.Find(CourseId);
            if (course == null)
            {
                return HttpNotFound();
            }
            else {
                if (course.LectureNotes == null) {
                    course.LectureNotes = db.LectureNotes.ToList().Where(ln => ln.CourseID == CourseId).ToList();
                }
            }
            
            return View(course);
        }
        //End
        //New method w/ new view:NewNotes.cshtml
        public ActionResult NewNotes(int? CourseId)
        {
            if (CourseId == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ViewData["CourseId"] = CourseId;
            return View();
        }

        [HttpPost]
        public ActionResult UploadNote(HttpPostedFileBase PdfLectureNote, string CourseId)
        {
            string path = Server.MapPath("~/App_Data/LectureNotes/");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            if (PdfLectureNote.ContentLength >= 6000000) {
                ViewData["CourseId"] = CourseId;
                ViewData["FileSize"] = PdfLectureNote.ContentLength/1000000;
                return View("NewNotes");
            }

            var supportedTypes = new[] { "pdf"};
            var fileExt = System.IO.Path.GetExtension(PdfLectureNote.FileName).Substring(1);
            if (!supportedTypes.Contains(fileExt))
            {
                ViewData["CourseId"] = CourseId;
                ViewData["FileType"] = fileExt;
                return View("NewNotes");
            }

            Course course = new Course();
            if (PdfLectureNote != null)
            {
                string fileName = Path.GetFileName(PdfLectureNote.FileName);
                PdfLectureNote.SaveAs(path + fileName);
                LectureNote ln = new LectureNote();
                ln.Id = 0;
                ln.LectureDate = DateTime.UtcNow;
                ln.PdfLectureNote = fileName;
                course = db.Courses.ToList().Where(c => c.Id == int.Parse(CourseId)).First();
                ln.Course = course;
                if (ModelState.IsValid)
                {
                    db.LectureNotes.Add(ln);
                    db.SaveChanges();
                }
            }

            return View("CourseDetails", course);
        }

        // GET: AssignCourse/Delete/5
        public ActionResult DeleteLectureNote(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            LectureNote ln = db.LectureNotes.Find(id);
            if (ln == null)
            {
                return HttpNotFound();
            }
            return View(ln);
        }

        // POST: AssignCourse/Delete/5
        [HttpPost, ActionName("DeleteLectureNote")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteLectureNoteConfirmed(int id)
        {
            LectureNote ln = db.LectureNotes.Find(id);
      
            string fullPath = Server.MapPath("~/App_Data/LectureNotes/" + ln.PdfLectureNote);
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            db.LectureNotes.Remove(ln);
            db.SaveChanges();
            
            return RedirectToAction("Index");
        }

    }
}
