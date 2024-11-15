using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class UpdatePassword
    {
        public string password { get; set; }

        public string newPassword { get; set; }

        public string confirmpassword { get; set; }


    }
}