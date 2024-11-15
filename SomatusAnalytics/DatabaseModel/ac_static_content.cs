namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_static_content
    {
        [Key]
        public int content_block_id { get; set; }

        public int client_id { get; set; }

        [Required]
        [StringLength(100)]
        public string uri { get; set; }

        [Required]
        [StringLength(100)]
        public string placeholder { get; set; }

        [Required]
        [StringLength(1000)]
        public string placeholder_text { get; set; }

        [Required]
        [StringLength(255)]
        public string updated_by { get; set; }

        public DateTime updated_on { get; set; }

        public string is_deleted { get; set; }
    }
}
