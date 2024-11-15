using SomatusAnalytics.DatabaseModel;

namespace SomatusAnalytics.Models
{
    public class MenuBuilder
    {
        public int id { get; set; }

        public int clientId { get; set; }
        public string uri { get; set; }
        public string origURI { get; set; }
        public string menu_icon { get; set; }
        public string category { get; set; }
        public string module_name { get; set; }
        public string is_menu { get; set; }
        public string is_access_controlled { get; set; }
        public int static_content_template_id { get; set; }
        public string is_static_content {get; set;}
        public int parent_module_id { get; set; }
        public int seqNo { get; set; }
        public ReportModel reportMenu { get; set; }
        public ac_static_content[] staticContent { get; set; }
        public int[] roleIds { get; set; }

    }
}