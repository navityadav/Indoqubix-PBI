using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ReportDownloadRequest
    {
        public int exportId { get; set; }
        public string fileName { get; set; }

        public string email { get; set; }

        public bool isAttachment { get; set; }


        public int userId { get; set; }
        public int clientId { get; set; }

        public string userName { get; set; }

        public string envURL { get; set; }
    }
}