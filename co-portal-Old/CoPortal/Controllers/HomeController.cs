using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.Entity;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CoPortal.DAL;
using CoPortal.Models;
using CoPortal.Login;
using CoPortal.Helpers;


namespace CoPortal.Controllers
{
    public class HomeController : Controller
    {
        private PortalContext db = new PortalContext();

        public ActionResult Index()
        {
            return RedirectToAction("Login");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Login()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login([Bind(Include = "Username,Password")] LoginCredentials user)
        {
            if (ModelState.IsValid && user.Password != null && user.Username != null)
            {
                //var password = PasswordHelper.Hash(user.Password);
                var password = user.Password;
                if (user.Username.Contains("S"))
                {
                    Student student = db.Students.FirstOrDefault(x => x.Password == password);
                    if (student != null)
                    {
                        if (student.StudentNumber.Equals(user.Username))
                        {
                            HttpContextHelper.Session = "STUDENT";
                            HttpContextHelper.SessionUserId = student.Id;
                            return RedirectToAction("detailsStudent", "Student", new { id = student.Id });
                        }
                    }

                }
                else if (user.Username.Contains("L"))
                {
                    Lecturer lecturer = db.Lecturers.ToList().FirstOrDefault(x => x.Password == password);
                    if (lecturer != null)
                    {
                        if (lecturer.LecturerNumber.Equals(user.Username))
                        {
                            HttpContextHelper.Session = "LECTURER";
                            HttpContextHelper.SessionUserId = lecturer.Id;
                            return RedirectToAction("detailsLecturer", "lecturer", new { id = lecturer.Id });
                        }
                    }
                }
                else if (user.Username.Contains("A"))
                {
                    Admin admin = db.Admins.FirstOrDefault(x => x.Password == password);
                    if (admin != null)
                    {
                        if (admin.AdminNumber.Equals(user.Username))
                        {
                            HttpContextHelper.Session = "ADMIN";
                            HttpContextHelper.SessionUserId = admin.Id;
                            return RedirectToAction("Index", "Student");
                        }
                    }
                }
            }
                
            return RedirectToAction("Login");
        }

        public ActionResult Logout()
        {
            HttpContextHelper.Session = null;

            return RedirectToAction("Index");
        }
    }
}