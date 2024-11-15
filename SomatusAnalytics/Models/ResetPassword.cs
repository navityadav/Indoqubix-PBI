using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ResetPassword
    {
        public string verificationCode { get; set; }
        public string email { get; set; }
        public string displayName { get; set; }

        public string newPassword { get; set; }

        public string confirmpassword { get; set; }

        public string error { get; set; }
    }
}