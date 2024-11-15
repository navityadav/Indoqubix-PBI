using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ClientModel
    { 
        public int clientId { get; set; }

        public string clientName { get; set; }

        public string clientDomain {get; set;}

        public string clientReportFilters { get; set; }

    }
}