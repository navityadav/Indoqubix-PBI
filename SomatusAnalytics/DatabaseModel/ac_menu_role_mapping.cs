namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_menu_role_mapping
    {
        [Key]
        public int menu_role_mapping_id { get; set; }

        public int menu_id { get; set; }

        public int role_id { get; set; }

        [StringLength(100)]
        public string updated_by { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
