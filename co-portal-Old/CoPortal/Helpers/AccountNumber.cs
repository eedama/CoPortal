using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoPortal.Helpers
{
    public class AccountNumber
    {
        public static string NextStudentNumber(string lastnumber)
        {
            string[] parts = lastnumber.Split('S');
            var newStudentNumber = "";
            var number = AddZeros((int.Parse(parts[1]) + 1), 5);
            if (DateTime.Now.Year.Equals(int.Parse(parts[0])))
            {
                newStudentNumber = parts[0] + "S" + number;
            }
            else
            {
                newStudentNumber = DateTime.Now.Year.ToString() + "S" + number;
            }
            return newStudentNumber;
        }

        public static string NextAdminNumber(string lastnumber)
        {
            string[] parts = lastnumber.Split('S');
            var newAdminNumber = "";
            var number = AddZeros((int.Parse(parts[1]) + 1), 4);
            if (DateTime.Now.Year.Equals(int.Parse(parts[0])))
            {
                newAdminNumber = parts[0] + "S" + number;
            }
            else
            {
                newAdminNumber = DateTime.Now.Year.ToString() + "S" + number;
            }
            return newAdminNumber;
        }

        public static string NextLecturerNumber(string lastnumber)
        {
            string[] parts = lastnumber.Split('L');
            var newLecturerNumber = "";
            var number = AddZeros((int.Parse(parts[1]) + 1), 4);
            if (DateTime.Now.Year.Equals(int.Parse(parts[0])))
            {
                newLecturerNumber = parts[0] + "L" + number;
            }
            else
            {
                newLecturerNumber = DateTime.Now.Year.ToString() + "L" + number;
            }
            return newLecturerNumber;
        }

        private static string AddZeros(int number, int max)
        {
            string final = "";
            int diff = max - number.ToString().Length;
            for (var i = 0; i < diff; i++)
            {
                final += "0";
            }
            return final += number;
        }
    }
}