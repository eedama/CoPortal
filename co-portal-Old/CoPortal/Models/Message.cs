using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string MessageContent { get; set; }
        public DateTime MessageDate { get; set; }
    }
}