namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ac_email_template
    {
        [Key] 
        public int template_id { get; set; }

        [Required]
        [StringLength(255)]
        public string template_name { get; set; }

        [Required]
       
        public string template_content { get; set; }

        [Required]
        [StringLength(255)]
        public string subject { get; set; }

        [Required]
        [StringLength(255)]
        public string mode { get; set; }

        [Required]
        [StringLength(255)]
        public string updated_by { get; set; }


        public DateTime? updated_on { get; set; }

        
    }
}
