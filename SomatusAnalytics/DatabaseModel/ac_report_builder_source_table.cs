namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_report_builder_source_table
    {
        [Key]
        [Column(Order = 0)]
        public int source_table_id { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int db_setting_id { get; set; }

        [Key]
        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int client_id { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(255)]
        public string table_name { get; set; }

        [Key]
        [Column(Order = 5, TypeName = "text")]
        public string fields { get; set; }

        [Column(TypeName = "text")]
        public string condition { get; set; }

        [Column(Order =4)]
        [StringLength(255)]
        public string display_name { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(255)]
        public string updated_by { get; set; }

        [Key]
        [Column(Order = 7)]
        public DateTime updated_on { get; set; }
    }
}
