using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public enum AssignmentType
    {
        Test = 1, Exam = 2, Assignment = 3, classtest
    }

    public class AssigmentQuestion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string QuestionPdf { get; set; }
        public AssignmentType AssignmentType { get; set; }
        public ICollection<Assignment> StudentSubmissions { get; set; }
    }
}