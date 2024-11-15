using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ReportBuilderData
    {
        public int draw { get; set; }

        public int recordsTotal { get; set; }

        public int recordsFiltered { get; set; }

        public List<string[]> data { get; set; }

    }
}