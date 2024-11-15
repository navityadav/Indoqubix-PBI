namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_client_master
    {
        [Key]
        public int client_id { get; set; }

        [StringLength(255)]
        public string client_name { get; set; }

        [StringLength(255)]
        public string client_report_filters { get; set; }        

        [StringLength(255)]
        public string client_domain { get; set; }

        [StringLength(255)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
