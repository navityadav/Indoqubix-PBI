namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public class ac_report_export_history
    {
        [Key]
        public int report_export_id { get; set; }

        [Column(Order = 1)]
        public int schedule_id { get; set; }

        [Column(Order = 2)]
        public int user_id { get; set; }


        [Column(Order = 3)]
        [StringLength(255)]
        public string download_path { get; set; }

        [Column(Order = 4)]
        [StringLength(255)]
        public string email_id { get; set; }

        [Column(TypeName = "datetime2", Order=5)]
        public DateTime? schedule_start_datetime { get; set; }

        [Column(TypeName = "datetime2",Order=6)]
        public DateTime? schedule_end_datetime { get; set; }

        [Column(Order = 8)]
        public int download_count { get; set; }

        [Column(Order = 9)]
        [StringLength(255)]
        public string subject { get; set; }

        [Column(Order = 10)]
        [StringLength(255)]
        public string message { get; set; }

        
        [Column(TypeName = "datetime2", Order = 11)]
        public DateTime? available_upto_date { get; set; }

        [Column(Order = 12)]
        [StringLength(1)]
        public string status { get; set; }

        [StringLength(100)]
        public string reference_id { get; set; }

        [StringLength(100)]
        public string type { get; set; }

        public int read_status { get; set; }

        public int progress { get; set; }

        public int client_id { get; set; }

        [StringLength(100)]
        public string report_name { get; set; }

        [StringLength(100)]
        public string instance { get; set; }


    }
}