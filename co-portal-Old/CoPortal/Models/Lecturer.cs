using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Lecturer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string LecturerNumber { get; set; }
        [StringLength(13)]
        public string IdNumber { get; set; }
        public string DateOfBirth
        {
            get
            {
                if (IdNumber == null || IdNumber.Length != 13) return "Invalid ID number";
                return IdNumber.Substring(0, 2) + "-" + IdNumber.Substring(2, 2) + "-" + IdNumber.Substring(4, 2);
            }
        }
        public ICollection<AssignCourse> AssignedCourses { get; set; }
    }
}