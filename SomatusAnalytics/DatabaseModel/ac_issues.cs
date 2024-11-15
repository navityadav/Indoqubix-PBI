namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_issues
    {
        [Key]
        public int issue_id { get; set; }

        public int? client_id { get; set; }

        public int? user_id { get; set; }

        [StringLength(255)]
        public string issue { get; set; }

        [Column(TypeName = "text")]
        public string issue_desc { get; set; }

        [StringLength(100)]
        public string priority { get; set; }

        [StringLength(100)]
        public string status { get; set; }

        public DateTime? requested_on { get; set; }

        [StringLength(100)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
