namespace CoPortal.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int CourseID { get; set; }
        public int StudentID { get; set; }
        public bool FeesPaid { get; set; }

        public virtual Student Student { get; set; }
        public virtual Course Course { get; set; }
    }
}