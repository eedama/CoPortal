using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class LectureNote
    {
        public int Id { get; set; }
        public int CourseID { get; set; }
        public DateTime LectureDate { get; set; }
        public string PdfLectureNote { get; set; }

        public virtual Course Course { get; set; }
    }
}