using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Login
{
    public static class HttpContextHelper
    {
        public static string Session
        {
            get
            {
                return HttpContext.Current.Session["_type"].ToString();
            }
            set
            {
                HttpContext.Current.Session["_type"] = value;
            }
        }

        public static int SessionUserId
        {
            get
            {
                if(HttpContext.Current.Session["_userId"] != null)
                {
                    return (int)HttpContext.Current.Session["_userId"];
                }
                return 0;
            }
            set
            {
                HttpContext.Current.Session["_userId"] = value;
            }
        }

    }
}