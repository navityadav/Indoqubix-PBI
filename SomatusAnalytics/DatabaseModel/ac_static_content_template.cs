namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_static_content_template
    {
        [Key]
        public int template_id { get; set; }

        [StringLength(100)]
        public string template_name { get; set; }

        [Column(TypeName = "text")]
        public string template { get; set; }

        [StringLength(100)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
