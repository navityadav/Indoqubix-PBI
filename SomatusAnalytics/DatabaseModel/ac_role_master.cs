namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_role_master
    {
        [Key]
        public int role_id { get; set; }

        [StringLength(100)]
        public string role { get; set; }

        [StringLength(1)]
        public string is_active { get; set; }

    }
}
