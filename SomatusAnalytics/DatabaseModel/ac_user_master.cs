namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_user_master
    {
        [Key]
        public int user_id { get; set; }

        public int? client_id { get; set; }

        [StringLength(50)]
        public string login_id { get; set; }

        [StringLength(255)]
        public string password { get; set; }

        [StringLength(255)]
        public string login_type { get; set; }

        [StringLength(255)]
        public string display_Name { get; set; }

        [StringLength(255)]
        public string email { get; set; }

        [StringLength(20)]
        public string mobile_no { get; set; }

        [StringLength(1)]
        public string is_deleted { get; set; }

        [StringLength(1)]
        public string is_active { get; set; }

        [StringLength(1)]
        public string is_first_time_login { get; set; }

        [StringLength(255)]
        public string updated_by { get; set; }


        [StringLength(255)]
        public string email_verification_code { get; set; }

        public DateTime? updated_on { get; set; }
    }
}
