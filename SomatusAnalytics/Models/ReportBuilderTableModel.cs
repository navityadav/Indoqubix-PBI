using System.Data;

namespace SomatusAnalytics.Models
{
    public class ReportBuilderTableModel
    {
        public string report_name { get; set; }

        public int table_id { get; set; }

        public string table_name { get; set; }

        public System.Collections.Generic.List<ReportBuilderTableColumn> columns { get; set; }

        public System.Collections.Generic.List<ReportBuilderCondition> condition { get; set; }

        public DataTable data { get; set; }

        public string error { get; set; }

        public string query { get; set; }

        public string global_condition { get; set; }

        public string listColumn { get; set; }

        public int is_update { get; set; }

        public int report_id { get; set; }

    }
}