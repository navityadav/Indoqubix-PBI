using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class UserModel
    {
        public int userId { get; set; }

        public int clientId { get; set; }

        public int[] roleIds { get; set; }
        public int[] clientIds { get; set; }
        public Dictionary<int, String> clients { get; set; }

        public Dictionary<int, String>  role { get; set; }

        public string clientName { get; set; }

        public string loginId { get; set; }
        public string loginType { get; set; }
        public string displayName { get; set; }

        public string email { get; set; }

        public string mobile { get; set; }

        public string isDeleted { get; set; }

        public string isActive { get; set; }

        public string emailVerificationCode { get; set; }

        public string isFirstTimeLogin { get; set; }

        public string clientDomain { get; set; }

        public List<ac_user_report_filter_mapping> filterMappings { get; set; }

    }
}