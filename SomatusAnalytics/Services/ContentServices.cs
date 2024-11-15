
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SomatusAnalytics.Services
{
    public class ContentServices
    {

        [System.Web.Mvc.OutputCache(Duration = 1800)]
        public List<ac_powerbi_report> getReportList(int clientId)
        {
            using (DBModel db = new DBModel())
            {
                List<ac_powerbi_report> oReports = db.ac_powerbi_report.Where(a => a.client_id == clientId).ToList<ac_powerbi_report>();
                return oReports;
            }
        }


        

        [System.Web.Mvc.OutputCache(Duration = 1800)]
        public List<ac_static_content_template> getTemplates()
        {
            using (DBModel db = new DBModel())
            {

                List<ac_static_content_template>  oTemplates = db.ac_static_content_template.ToList<ac_static_content_template>();
                return oTemplates;
            }
        }


        [System.Web.Mvc.OutputCache(Duration = 1800)]
        public List<StaticContentBlocks> getPlaceHolders(int clientId,string uri)
        {
            
            using (DBModel db = new DBModel())
            {
                List<StaticContentBlocks> oPlaceHolders = new List<StaticContentBlocks>();
                List<ac_static_content>  oStaticContents = db.ac_static_content.Where(a => a.client_id == clientId && a.uri.Equals(uri)).OrderBy(a => a.placeholder).ToList<ac_static_content>();
                foreach (var oStaticContent in oStaticContents) // Loop through List with foreach
                {
                    StaticContentBlocks oPlaceHolder = new StaticContentBlocks();
                    oPlaceHolder.title = oStaticContent.placeholder;
                    oPlaceHolder.placeholder = oStaticContent.placeholder_text;
                    oPlaceHolders.Add(oPlaceHolder);
                }
                return oPlaceHolders;
            }
        }


        [System.Web.Mvc.OutputCache(Duration = 1800)]
        public List<StaticContentBlocks> getPlaceHolderTemplates(string templateName,string reqType)
        {

            using (DBModel db = new DBModel())
            {
                List<StaticContentBlocks> oPlaceHolders = new List<StaticContentBlocks>();
                int templateId= int.Parse(templateName);
                List<ac_static_content_template> oStaticContents = db.ac_static_content_template.Where(a => a.template_id == templateId).ToList<ac_static_content_template>();
                foreach (var oStaticContent in oStaticContents) // Loop through List with foreach
                {
                    StaticContentBlocks oPlaceHolder = new StaticContentBlocks();
                    if (reqType == "TEMPLATE")
                        oPlaceHolder.title = oStaticContent.template;
                    else if (reqType == "TEMPLATE_NAME")
                        oPlaceHolder.title = oStaticContent.template_name;
                    oPlaceHolders.Add(oPlaceHolder);
                }
                return oPlaceHolders;
            }
        }


        [System.Web.Mvc.OutputCache(Duration = 1800)]
        public ReportModel getReport(int clientId,string uri)
        {
            
            using (DBModel db = new DBModel())
            {
                ReportModel oReport = new ReportModel();
                ac_powerbi_report odbReport = db.ac_powerbi_report.Where(a => a.client_id == clientId && a.uri.Equals(uri)).FirstOrDefault<ac_powerbi_report>();

                if (odbReport != null)
                {
                    oReport.clientId = odbReport.client_id;
                    oReport.uri = odbReport.uri;
                    oReport.title = odbReport.title;
                    oReport.subtitle = odbReport.subtitle;
                    oReport.workspaceId = odbReport.workspace_id;
                    oReport.reportId = odbReport.report_id;
                    oReport.showFilter = odbReport.show_filter;
                    oReport.showFilter = odbReport.show_filter;
                    oReport.showTab = odbReport.show_tab;
                    oReport.id = odbReport.id;
                }
                return oReport;
            }
        }

      
        public bool isURIAvailibleForClient(MenuBuilder mb)
        {
            using (DBModel db = new DBModel())
            {
                try {

                    var menuList = db.ac_menu.Where(a => a.client_id == mb.clientId && a.uri.Equals(mb.uri)).ToList<ac_menu>();
                    if (menuList != null && menuList.Count > 0)
                        return false;
                }
                catch (Exception ex)
                {
                    var msg = ex.Message;
                    Console.WriteLine(msg);
                    Console.Write(ex.StackTrace);
                    return false;
                }
                return true;
            }
        }


        internal bool delMenuContent(MenuBuilder mb) {
            try
            {
                // Addd TimeStamp 
                using (DBModel db = new DBModel())
                {
                    // Update Menu
                   ac_menu menu = new ac_menu();
                    menu = db.ac_menu.Where(a => a.menu_id == mb.id)
                                 .FirstOrDefault<ac_menu>();
                    menu.uri = "del-"+mb.uri+"-"+menu.menu_id + "-" + DateTime.Now.Millisecond;
                    menu.is_deleted = "Y";
                   
               
                    // Update Report
                    if (mb.is_static_content == "N")
                    {
                        ac_powerbi_report report = new ac_powerbi_report();
                        report = db.ac_powerbi_report.Where(a => a.uri == mb.uri && a.client_id == mb.clientId)
                        .FirstOrDefault<ac_powerbi_report>();

                        report.uri = menu.uri;
                        report.is_deleted = "Y";
                       
                    }
                    else {
                        //DELETE  ALL existing static content
                        var contentList = db.ac_static_content.Where(a => a.client_id == mb.clientId && a.uri.Equals(mb.uri)).ToList<ac_static_content>();

                        if (contentList != null)
                        {
                            foreach (ac_static_content content in contentList)
                            {
                                content.uri = menu.uri;
                                content.is_deleted = "Y";
                                
                            }
                            
                        }

                    }

                    //DELETE  ALL existing roles
                    var roles = db.ac_menu_role_mapping.Where(a => a.menu_id == mb.id).ToList<ac_menu_role_mapping>();
                    foreach (ac_menu_role_mapping role in roles)
                    {
                        db.ac_menu_role_mapping.Remove(role);
                    }
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }
            return true;
        }

        internal bool saveMenuContent(MenuBuilder mb,string reqType)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    if (mb.uri == null || mb.uri.Equals(""))
                    {
                        return false;
                    }

                    // TO CHECK AGAIN. to be done in case of ADD ONLY
                     if (reqType.Equals("ADD") && !isURIAvailibleForClient(mb))
                        {
                            return false;
                      }
                    
                    ac_menu menu = new ac_menu();
                     if (reqType.Equals("UPD"))
                    {
                        menu = db.ac_menu.Where(a => a.menu_id == mb.id)
                         .FirstOrDefault<ac_menu>();
                    }

                        menu.client_id = mb.clientId;
                        menu.category = mb.category;
                        menu.module_name = mb.module_name;
                        menu.menu_icon = mb.menu_icon;
                        menu.is_menu = mb.is_menu;
                        menu.is_access_controlled = mb.is_access_controlled;
                        menu.is_static_content = mb.is_static_content;
                        menu.static_content_template_id = mb.static_content_template_id;
                        menu.parent_module_id = mb.parent_module_id;
                        menu.seq_no = mb.seqNo;
                      

                    if (reqType.Equals("ADD") || menu == null)
                    {
                        menu.uri = mb.uri;
                        db.ac_menu.Add(menu);
                    }
                    
                    db.SaveChanges();
                    //Add Client Mappings

                    //Add Role Mappings
                    //Add role as specified
                    if (mb.reportMenu != null) {
                        saveReport(mb.uri,mb.reportMenu, reqType);
                    }
                    if (mb.staticContent != null) {
                        StaticContentService sc = new StaticContentService();
                        sc.setStaticConent(mb.clientId, mb.uri, mb.staticContent, reqType);
                    }
                    saveMenuRoleMappings(menu.menu_id, mb.roleIds,reqType);


                    
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }
            return true;
        }

        internal bool saveReport(string reportURI,ReportModel rm,string reqType)
            {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_powerbi_report report = new ac_powerbi_report();
                    if (reqType.Equals("UPD"))
                    {
                        report = db.ac_powerbi_report.Where(a => a.uri == rm.uri && a.client_id==rm.clientId)
                         .FirstOrDefault<ac_powerbi_report>();
                    }

                    report.client_id = rm.clientId;
                    
                    report.subtitle = rm.subtitle;
                    report.title = rm.title;
                    report.workspace_id = rm.workspaceId;
                    report.report_id = rm.reportId;
                    report.show_filter = rm.showFilter;
                    report.show_tab = rm.showTab;
                    report.is_deleted = "N";


                    if (reqType.Equals("ADD") || report==null)
                    {
                        report.uri = reportURI;
                        db.ac_powerbi_report.Add(report);
                    }
                    
                    


                    db.SaveChanges();
                   
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }
            return true;
        }

        internal void saveMenuRoleMappings(int menuId, int[] roleIds,string reqType)

        {
            if (roleIds != null)
            {
                using (DBModel db = new DBModel())
                {

                    // If Request Type is Update - Remove Existing Roles First
                    if (reqType == "UPD")
                    {
                        //DELETE  ALL existing roles
                        var roles = db.ac_menu_role_mapping.Where(a => a.menu_id == menuId).ToList<ac_menu_role_mapping>();
                        foreach (ac_menu_role_mapping role in roles)
                        {
                            db.ac_menu_role_mapping.Remove(role);
                        }
                        db.SaveChanges();
                        

                    }

                    //Add All Roles to Menu
                    foreach (int roleId in roleIds)
                    {
                        //If no role found for user - add role
                        ac_menu_role_mapping roleMap = new ac_menu_role_mapping();
                        roleMap.role_id = roleId;
                        roleMap.menu_id = menuId;
                        roleMap.updated_by = UserContextManager.getUserName();
                        roleMap.updated_on = DateTime.Now;
                        db.ac_menu_role_mapping.Add(roleMap);
                        db.SaveChanges();
                    }
                }
            }
        }


        /****************** FINISH METHODS ************************/
    }
}