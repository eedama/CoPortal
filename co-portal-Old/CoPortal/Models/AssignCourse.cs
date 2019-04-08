namespace CoPortal.Models
{
    public class AssignCourse
    {
        public int Id { get; set; }
        public int CourseID { get; set; }
        public int LecturerID { get; set; }

        public virtual Lecturer Lecturer { get; set; }
        public virtual Course Course { get; set; }
    }
}