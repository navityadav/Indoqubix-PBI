using System;

namespace SomatusAnalytics.Controllers
{
    public class ExportRequestModel
    {
        public Guid reportId { get; set; }
       
        public string token { get; set; }

        public string reportName { get; set; }

        public string reportURI { get; set; }
    }
} 