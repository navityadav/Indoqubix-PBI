using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;

namespace SomatusAnalytics.Models
{
    public class ReportList
    {
        public List<ac_powerbi_report> reports { get; set; }
        public List<ClientModel> clients { get; set; }
        public List<ac_static_content_template> templates { get; set; }

        public int clientId { get; set; }
        public Dictionary<int, String> roles { get; set; }

        public List<MenuModel> menus { get; set; }


    }
}