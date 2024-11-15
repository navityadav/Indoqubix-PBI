namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_bi_access_app
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int app_id { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int client_id { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(255)]
        public string application_id { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(255)]
        public string app_user_name { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(255)]
        public string app_password { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(255)]
        public string application_secret { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(255)]
        public string tenant { get; set; }

        [Key]
        [Column(Order = 7)]
        [StringLength(255)]
        public string authority_uri { get; set; }

        [Key]
        [Column(Order = 8)]
        [StringLength(255)]
        public string resoruce_uri { get; set; }

        [Key]
        [Column(Order = 9)]
        [StringLength(255)]
        public string updated_by { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? updated_on { get; set; }

        [StringLength(255)]
        public string authority_type { get; set; }

        [StringLength(255)]
        public string api_url { get; set; }
    }
}
