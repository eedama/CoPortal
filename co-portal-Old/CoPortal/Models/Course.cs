using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Course
    {
        //public Course() {
        //    if (LectureNotes == null) {
        //        LectureNotes = new System.Collections.ObjectModel.Collection<LectureNote>();
        //    }
        //}

        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public ICollection<Enrollment> StudentEnrollments { get; set; }
        public ICollection<AssigmentQuestion> AssigmentQuestions { get; set; }
        public ICollection<Message> NoticeBoard { get; set; }
        public ICollection<LectureNote> LectureNotes { get; set; }
    }
}