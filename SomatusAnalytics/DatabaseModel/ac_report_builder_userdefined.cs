namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_report_builder_userdefined
    {
        [Key]
        public int datatable_report_id { get; set; }

        public int client_id { get; set; }

        public int user_id { get; set; }

        public int display_seq { get; set; }

        public int source_table_id { get; set; }

        [Required]
        [StringLength(255)]
        public string report_name { get; set; }

        [StringLength(255)]
        public string table_name { get; set; }

        [Column(TypeName = "text")]
        [Required]
        public string dataselection_json { get; set; }

        [Column(TypeName = "text")]
        [Required]
        public string query { get; set; }

        [Required]
        [StringLength(255)]
        public string updated_by { get; set; }

        [StringLength(255)]
        public string roles { get; set; }


        public DateTime updated_on { get; set; }
    }
}
