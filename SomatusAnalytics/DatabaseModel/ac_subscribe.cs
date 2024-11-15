namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_subscribe
    {
        [Key]
        public int subscribe_id { get; set; }

        public int client_id { get; set; }

        public int user_id { get; set; }

        [StringLength(255)]
        public string email_id { get; set; }

        [StringLength(255)]
        public string type { get; set; }

        [StringLength(255)]
        public string report_type { get; set; }

        [StringLength(255)]
        public string report_ref_id { get; set; }

        [StringLength(255)]
        public string report_name { get; set; }

        [StringLength(255)]
        public string frequency { get; set; }

        public int frequency_day { get; set; }

        public DateTime? subscribe_on { get; set; }

        public DateTime? last_sent_on { get; set; }

        public DateTime? next_schedule_date { get; set; }

        [StringLength(1)]
        public string is_deleted { get; set; }

        [StringLength(255)]
        public string subscribe_by { get; set; }

         [StringLength(255)]
        public string instance { get; set; }

    }
}
