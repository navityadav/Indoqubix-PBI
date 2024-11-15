namespace SomatusAnalytics.Models
{
    public class MenuModel
    {
        public int id { get; set; }
        public string uri { get; set; }
        public string label { get; set; }
        public bool is_public { get; set; }

        public int static_content_template_id { get; set; }
        public bool is_static {get; set;}
        public System.Collections.Generic.List<MenuModel> subMenu { get; set; }
        public int seqNo { get; set; }

        //Added for menu sequence saved in database.
        public int menuSeqNo { get; set; }
        public int? parentMenuId { get; set; }

        public string attributes { get; set; }

        public string showMenu { get; set; }
        
    }
}