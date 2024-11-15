using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class LoginModel
    {
        public string username { get; set; }

        public string password { get; set; }

        public string redirect { get; set; }

        public string otp { get; set; }

    }
}