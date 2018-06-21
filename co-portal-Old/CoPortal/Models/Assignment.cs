using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Assignment
    {
        public int Id { get; set; }
        public DateTime DateSubmitted { get; set; }
        public decimal Mark { get; set; }
        public string SubmittedPdf { get; set; }
    }
}