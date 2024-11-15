using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class SelfServiceReportDownloadRequest : ReportDownloadRequest
    {
        public string connectionStr { get; set; }

        public string query { get; set; }

    }
}