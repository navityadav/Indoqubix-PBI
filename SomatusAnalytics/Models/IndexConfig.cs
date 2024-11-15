using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class IndexConfig
    {
        public string DotNETSDK { get; internal set; }

        public string error { get; set; }

        public Boolean isADUser { get; set; }
    }
}