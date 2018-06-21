using CoPortal.DAL;
using CoPortal.Login;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace CoPortal.Controllers
{
    public class AnnouncementController : Controller
    {
        private PortalContext db = new PortalContext();

        [HttpGet]
        public async Task<JsonResult> LecturersAnnouncements(int courseID)
        {
            var lectureID =
                            HttpContextHelper.Session == "LECTURER" ? HttpContextHelper.SessionUserId : 0;
            if (lectureID == 0) throw new Exception("You are not logged in");

            var announcements = await db.Announcements.Where(a => a.LecturerId == lectureID && a.CourseId == courseID).ToListAsync();
            List<object> answer = new List<object>();
            
            foreach (var announcement in announcements) {
                answer.Add(new
                {
                    id = announcement.Id,
                    date = announcement.DateSent.DateTime.ToShortTimeString() + " " + announcement.DateSent.Date.ToShortDateString(),
                    message = announcement.Message
                });
            }

            return Json(answer,JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public async Task<JsonResult> StudentsAnnouncements(int courseID)
        {
            var studentID =
                            HttpContextHelper.Session == "STUDENT" ? HttpContextHelper.SessionUserId : 0;
            if (studentID == 0) throw new Exception("You are not logged in");

            var announcements = await db.Announcements.Where(a => a.StudentId == studentID && a.CourseId == courseID).ToListAsync();
            List<object> answer = new List<object>();

            foreach (var announcement in announcements)
            {
                answer.Add(new
                {
                    id = announcement.Id,
                    lecturer = announcement.Lecturer.Surname + " " + announcement.Lecturer.Name,
                    date = announcement.DateSent.DateTime.ToShortTimeString() + " " + announcement.DateSent.Date.ToShortDateString(),
                    message = announcement.Message
                });
            }

            return Json(answer, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<bool> Add(int courseID, string message)
        {
            var lectureID = HttpContextHelper.SessionUserId;
            if (lectureID == 0) return false;

            var studentIds = new List<int>();
            
            studentIds.AddRange(await db.Students.Where(c => c.CourseEnrollments.Any(p => p.CourseID == courseID)).Select(c => c.Id).ToListAsync());
        
            studentIds = studentIds.Distinct().ToList();

            foreach (var studentID in studentIds)
            {
                db.Announcements.Add(new Models.Announcement
                {
                    LecturerId = lectureID,
                    CourseId = courseID,
                    DateSent = DateTimeOffset.Now,
                    Message = message,
                    StudentId = studentID
                });
            }

            return await db.SaveChangesAsync() > -1;
        }

        [HttpPost]
        public async Task<bool> Delete(int id)
        {
            var announcement = await db.Announcements.FirstOrDefaultAsync(v => v.Id == id);

            if (announcement == null)
            {
                throw new Exception("Invalid Announcement");
            }

            db.Announcements.Remove(announcement);
            return await db.SaveChangesAsync() > -1;
        }

    }
}
