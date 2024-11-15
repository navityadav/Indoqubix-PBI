namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_user_report_filter_mapping
    {
        [Key]
        public int mapping_id { get; set; }

        public int? user_id { get; set; }

        public int? client_id { get; set; }


       // [StringLength(50)]
       // public string filter_table { get; set; }

        [StringLength(50)]
        public string filter_key { get; set; }

        [StringLength(255)]
        public string filter_value { get; set; }


        [StringLength(100)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
