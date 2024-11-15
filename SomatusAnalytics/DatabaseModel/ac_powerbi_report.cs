namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_powerbi_report
    {
        [Key]
        [Column(Order = 0)]
        public int id { get; set; }


        [Column(Order = 1)]
        [StringLength(255)]
         public string uri { get; set; }

        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int client_id { get; set; }

        [Required]
        [StringLength(255)]
        public string title { get; set; }

        [StringLength(255)]
        public string subtitle { get; set; }

        [Required]
        [StringLength(255)]
        public string workspace_id { get; set; }

        [Required]
        [StringLength(255)]
        public string report_id { get; set; }

        [Required]
        [StringLength(1)]
        public string show_filter { get; set; }

        [Required]
        [StringLength(1)]
        public string show_tab { get; set; }

        public string is_deleted { get; set; }
    }
}
