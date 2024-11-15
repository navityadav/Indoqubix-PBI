using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class FilterMappingModel
    {
        public int userId { get; set; }

        public int clientId { get; set; }

        public string filterKey { get; set; }

        public string filterValue { get; set; }

    }
}