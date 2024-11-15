namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_report_builder_db_setting
    {
        [Key]
        public int db_setting_id { get; set; }

        public int client_id { get; set; }

        [Required]
        [StringLength(100)]
        public string db_server { get; set; }

        public int db_port { get; set; }

        [Required]
        [StringLength(100)]
        public string db_name { get; set; }

        [Required]
        [StringLength(100)]
        public string db_type { get; set; }

        [Required]
        [StringLength(100)]
        public string db_username { get; set; }

        [Required]
        [StringLength(100)]
        public string db_password { get; set; }

        public string db_read_only { get; set; }

        [Required]
        [StringLength(255)]
        public string updated_by { get; set; }

        public DateTime updated_on { get; set; }
    }
}
