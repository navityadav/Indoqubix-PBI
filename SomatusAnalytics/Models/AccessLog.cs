using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class AccessLog
    {
        public int userId { get; set; }

        public int clientId { get; set; }

        public string userBrowser { get; set; }

        public string requestedURI { get; set; }
        public string requestType { get; set; }
        public string userIP { get; set; }

        public DateTime accessTime { get; set; }



    }
}