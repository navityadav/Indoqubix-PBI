namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_report_published
    {
        
        [Key]
        public Guid published_uri { get; set; }

        public int? client_id { get; set; }

        public int? user_id { get; set; }

        [StringLength(255)]
        public string report_type { get; set; }

        [StringLength(100)]
        public string ref_uri { get; set; }

        public DateTime? published_on { get; set; }

    }
}
