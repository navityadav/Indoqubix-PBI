using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class PowerBIReportFilter
    {
        public string table { get; set; }

        public string column { get; set; }

        public string value { get; set; }

    }
}