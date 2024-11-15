namespace SomatusAnalytics.Models
{
    public class ReportBuilderDisplayConfig
    {
        public System.Collections.Generic.List<ReportBuilderSavedReport> reports { get; set; }

        public int selectedReportId { get; set; }
        public ReportBuilderTableModel selectedReport { get; set; }
        public int reportCreatorId { get; set; }
        public string title{get;set;}

    }
}