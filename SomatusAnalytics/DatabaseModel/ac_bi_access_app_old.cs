namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_bi_access_app_old
    {
        [Key]
        public int app_id { get; set; }

        public int client_id { get; set; }

        [Required]
        [StringLength(255)]
        public string application_id { get; set; }

        [Required]
        [StringLength(255)]
        public string app_user_name { get; set; }

        [Required]
        [StringLength(255)]
        public string app_password { get; set; }

        [Required]
        [StringLength(255)]
        public string application_secret { get; set; }

        [Required]
        [StringLength(255)]
        public string tenant { get; set; }

        [Required]
        [StringLength(255)]
        public string authority_uri { get; set; }

        [Required]
        [StringLength(255)]
        public string resoruce_uri { get; set; }

        [Required]
        [StringLength(255)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }

        [StringLength(255)]
        public string authority_type { get; set; }

        [StringLength(255)]
        public string api_url { get; set; }
    }
}
