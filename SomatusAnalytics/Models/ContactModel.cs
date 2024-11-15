using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ContactModel
    {

        public int? client_id { get; set; }
        public int? user_id { get; set; }
        public string subject { get; set; }
		public string report { get; set; }
		public string comments { get; set; }

    }
}