namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_client_user_mapping
    {
        [Key]
        public int mapping_id { get; set; }

        public int? user_id { get; set; }

        public int? client_id { get; set; }

        [StringLength(100)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
