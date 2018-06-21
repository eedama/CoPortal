using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Admin
    {
        public int Id { get;set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string AdminNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}