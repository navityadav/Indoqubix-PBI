namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_menu
    {
        [Key]
        public int menu_id { get; set; }

        public int? client_id { get; set; }

        [StringLength(255)]
        public string category { get; set; }

        [StringLength(255)]
        public string module_name { get; set; }

        [StringLength(255)]
        public string uri { get; set; }

        [StringLength(1)]
        public string is_menu { get; set; }

        [StringLength(1)]
        public string is_access_controlled { get; set; }

        [StringLength(1)]
        public string is_static_content { get; set; }

        public int? static_content_template_id { get; set; }

        public int? parent_module_id { get; set; }
        public string menu_icon { get; set; }
        public int? seq_no { get; set; }
        public string is_deleted { get; set; }
    }
}
