using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class IQReportConfig
    {
        public string reportTitle { get; set; }
        public string reportSubTitle { get; set; }
        public string AuthorityType { get; set; }
        public  string AuthorityUrl { get; set; }
        public string ResourceUrl { get; set; }
        public string ApplicationId { get; set; }
        public string ApiUrl { get; set; }
        public Guid WorkspaceId { get; set; }
        public Guid ReportId { get; set; }
        public string AuthenticationType  { get; set; }
        public string ApplicationSecret { get; set; }
        public string Tenant { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ShowTab { get; set; }
        public string ShowFilter { get; set; }
    }
}