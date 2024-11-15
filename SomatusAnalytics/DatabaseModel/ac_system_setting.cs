namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_system_setting
    {
        [Key]
        public int server_id { get; set; }

        [StringLength(100)]
        public string auth_type { get; set; }

        [StringLength(255)]
        public string ad_authority_url { get; set; }

        [StringLength(255)]
        public string ad_resource_url { get; set; }

        [StringLength(100)]
        public string ad_application_id { get; set; }

        [StringLength(255)]
        public string static_content_base_url { get; set; }

        [StringLength(255)]
        public string static_content_signature { get; set; }

        public DateTime? updated_on { get; set; }

        [StringLength(255)]
        public string updated_by { get; set; }
    }
}
