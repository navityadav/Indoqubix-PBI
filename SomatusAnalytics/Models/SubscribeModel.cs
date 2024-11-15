using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class SubscribeModel
    {
		public string frequency { get; set; }
        public int frequencyDay { get; set; }
        public string fileName { get; set; }
		public string reportId { get; set; }
		public string reportName { get; set; }
		public string type { get; set; }

        public string reportType { get; set; }
    }
}