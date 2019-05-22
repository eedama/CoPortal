using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Announcement
    {
        public int Id { get; set; }
        public int LecturerId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public DateTimeOffset DateSent { get; set; }
        public string Message { get; set; }
        
        // Relationships
        public virtual Student Student { get; set; }
        public virtual Lecturer Lecturer { get; set; }
        public virtual Course Course { get; set; }
    }
}