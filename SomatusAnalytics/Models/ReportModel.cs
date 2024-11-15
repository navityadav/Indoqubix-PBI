using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ReportModel
    {
        public int id { get; set; }
        public int clientId { get; set; }

        

        public string uri { get; set; }
        public string origURI { get; set; }
        public string title { get; set; }

        public string subtitle { get; set; }
        public string workspaceId { get; set; }
        public string reportId { get; set; }

        public string showFilter { get; set; }

        public string showTab { get; set; }


    }
}