using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class UserContextModel
    {
        public int userId { get; set; }

        public int clientId { get; set; }

        public int selectedClientId { get; set; }

        public string role { get; set; }

        public string displayName { get; set; }

        public string loginId { get; set; }

        public List<MenuModel> menu{ get; set; }

        public List<ClientModel> clients { get; set; }

        public Dictionary<string, Boolean> menuDictionary { get; set; }

        public MenuModel defaultMenu { get; set; }

        public string defaultURI { get; set; }

        public string home { get; set; }

        public string email { get; set; }

        public Boolean isADUser { get; set; }

        public Boolean isFirstTimeLogin { get; set; }

        public List<PowerBIReportFilter> filter { get; set; }

       

    }
}