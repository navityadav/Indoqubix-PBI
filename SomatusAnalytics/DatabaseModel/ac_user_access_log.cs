namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_user_access_log
    {
        public long id { get; set; }

        
        public int user_id { get; set; }

        public int? client_id { get; set; }

        [StringLength(50)]
        public string user_browser { get; set; }

        [StringLength(255)]
        public string request_uri { get; set; }

        [StringLength(50)]
        public string request_type { get; set; }

        [StringLength(50)]
        public string user_ip { get; set; }


        public DateTime? accessed_on { get; set; }
    }
}
