namespace SomatusAnalytics.Models
{
    public class PowerBIReportDownloadRequest : ReportDownloadRequest
    {
        public string WorkspaceId { get; set; }
        public string ReportId { get; set; }
        public string token { get; set; }
        public string instance { get; set; }

        public string filters { get; set; }

        public int userId { get; set; }
        public int clientId { get; set; }
        public bool isAttachment { get; set; }

        public string userName { get; set; }

        public string envURL { get; set; }
      
    }
}