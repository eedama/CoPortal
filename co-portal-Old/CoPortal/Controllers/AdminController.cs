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

namespace CoPortal.Controllers
{
    public class AdminController : Controller
    {
        private PortalContext db = new PortalContext();

        // GET: Admin
        public ActionResult Index()
        {
            return View(db.Admins.ToList());
        }

        // GET: Admin/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Admin admin = db.Admins.Find(id);
            if (admin == null)
            {
                return HttpNotFound();
            }
            return View(admin);
        }

        // GET: Admin/Create
        public ActionResult Create()
        {
            Admin a = db.Admins.FirstOrDefault(p => p.Id == db.Admins.Max(x => x.Id));
            var newAdminNumber = AccountNumber.NextStudentNumber(a.AdminNumber);
            var admin = new Admin { AdminNumber = newAdminNumber, Password = newAdminNumber };
            return View(admin);
        }

        // POST: Admin/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Surname,AdminNumber,Email,Password")] Admin admin)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(admin.Password))
                {
                    var password = PasswordHelper.Hash(admin.Password);
                    admin.Password = admin.AdminNumber;
                    db.Admins.Add(admin);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            

            return View(admin);
        }

        // GET: Admin/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Admin admin = db.Admins.Find(id);
            if (admin == null)
            {
                return HttpNotFound();
            }
            return View(admin);
        }

        // POST: Admin/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Surname,Email")] Admin admin)
        {
            if (ModelState.IsValid)
            {
                var a = new Admin { Id = admin.Id, Name = admin.Name, Surname = admin.Surname };
                db.Admins.Attach(a);
                db.Entry(a).Property(x => x.Name).IsModified = true;
                db.Entry(a).Property(x => x.Surname).IsModified = true;
                db.Entry(a).Property(x => x.Email).IsModified = true;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(admin);
        }

        // GET: Admin/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Admin admin = db.Admins.Find(id);
            if (admin == null)
            {
                return HttpNotFound();
            }
            return View(admin);
        }

        // POST: Admin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Admin admin = db.Admins.Find(id);
            db.Admins.Remove(admin);
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
