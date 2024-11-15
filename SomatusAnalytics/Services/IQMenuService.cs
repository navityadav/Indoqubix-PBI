
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.EntitySql;
using System;
using System.Linq;
using System.Web.Mvc;


namespace SomatusAnalytics.Services
{
    public class IQMenuService
    {
        private static Dictionary<int, MenuModel> defaultCLientURIDictionary = new Dictionary<int, MenuModel>();

        public static void setDefaultClientURI(int clientId, MenuModel defaultURI )
        {
            if (!defaultCLientURIDictionary.ContainsKey(clientId)) 
                defaultCLientURIDictionary.Add(clientId, defaultURI);
        }

        public static MenuModel getDefaultClientURI(int clientId)
        {
            return defaultCLientURIDictionary[clientId];
        }

        public dynamic getRoleByMenuId(int menuId, string reqType)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var roles = db.ac_menu_role_mapping.Where(a => a.menu_id == menuId).ToList<ac_menu_role_mapping>();
                    Dictionary<int, String> roleMappings = new Dictionary<int, string>();
                    var systemRoles = UserServices.getRoles();
                    foreach (var role in roles) // Loop through List with foreach
                    {
                        // Check if mapping role is active role
                        if (systemRoles.ContainsKey(role.role_id)) { 
                            if (!roleMappings.ContainsKey(role.role_id))
                            {
                                roleMappings.Add(role.role_id, systemRoles[role.role_id]);
                            }
                        }
                    }
                    if (reqType == "GET_ROLE_ID")
                    {
                        return roleMappings.Keys.ToArray<int>();
                    }
                    return roleMappings;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                if (reqType == "GET_ROLE_ID")
                    return 0;
                else
                    return "Role Not Assigned";
            }
        }

        [OutputCache(Duration = 1800)]
        public List<MenuModel>  getClientMenu(int clientId, int userId)
        {
            /** Default Selected Menu URI*/
            MenuModel defaultReportURI = null;

            /* Prepare Menu */
            List<MenuModel> displayMenu = new List<MenuModel>();

            Dictionary<int, MenuModel> tempMenuDict = new Dictionary<int, MenuModel>();

            /**
             * Key => Display Lable , Value => List of Menu Items
             * 
             * **/
            using (DBModel db = new DBModel())
            {
                /** 
                 * condition - menu_id in (seletc menu_id from ac_menu_role_mapping
                 */
                 var menuList = new List<view_user_menu>();
                if (userId == 0)
                {
                    menuList = db.view_user_menu.Where(a => a.client_id == clientId).OrderBy(a => a.parent_module_id).OrderBy(a => a.seq_no).ToList<view_user_menu>();
                   

                }  // else//Add User Id in conditions and change ac_menu to ac_user_menu
                else
                {
                     menuList = db.view_user_menu.Where(a => a.client_id == clientId && a.user_id == userId)
                        .OrderBy(a => a.parent_module_id).ThenBy(a => a.role_id).ThenBy(a => a.seq_no).ToList<view_user_menu>();
                }

                Dictionary<int, view_user_menu> tempMenu = new Dictionary<int, view_user_menu>();
                foreach (var menuItem in menuList) // Loop through List with foreach
                {
                    if (!tempMenu.ContainsKey(menuItem.menu_id))
                    {
                        tempMenu.Add(menuItem.menu_id, menuItem);
                    }
                }
                menuList = tempMenu.Values.ToList<view_user_menu>();


                int seqNo = 0;
                //Skip Non Menu cases if user id not 0  and is_Menu N
                foreach (var menuItem in menuList) // Loop through List with foreach
                {
                    if (menuItem.is_menu.Equals("N") && userId!=0)
                    {
                        continue;
                    }
                    
                    int parent_module_id = (int)menuItem.parent_module_id;
                    MenuModel oMenu = new MenuModel();
                    oMenu.id = menuItem.menu_id;
                    oMenu.label = menuItem.module_name;
                    if (menuItem.is_static_content.Equals("Y"))
                        oMenu.is_static = true;
                    else
                        oMenu.is_static = false;

                    oMenu.menuSeqNo = (int)menuItem.seq_no;
                    oMenu.showMenu = menuItem.is_menu;
                    oMenu.parentMenuId = menuItem.parent_module_id;
                    oMenu.is_public = (menuItem.is_access_controlled=="Y")?true:false;

                    oMenu.uri = menuItem.uri;
                    oMenu.static_content_template_id = (int)menuItem.static_content_template_id; //Added Static Content Template
                    oMenu.subMenu = null;

                    if (tempMenuDict.ContainsKey(parent_module_id))
                    {
                        MenuModel oParentMenu = tempMenuDict[parent_module_id];
                        if (oParentMenu.subMenu == null)
                        {
                            oParentMenu.subMenu = new List<MenuModel>();
                        }
                        oParentMenu.subMenu.Add(oMenu);
                        displayMenu[oParentMenu.seqNo] = oParentMenu;


                    }
                    /** If parent module id = 0, then consider this as parent node */
                    else
                    {
                        oMenu.seqNo = seqNo;
                        displayMenu.Add(oMenu);
                        //Add menu only if not already added
                        if (!tempMenuDict.ContainsKey(menuItem.menu_id))
                        {
                            tempMenuDict.Add(menuItem.menu_id, oMenu);
                        }
                        seqNo++;
                    }


                    /*
                       menu.Add(menuItem.module_name, menuItem.uri);*/
                    if (menuItem.seq_no == 0 && defaultReportURI == null)
                    {
                        defaultReportURI = oMenu;
                    }
                }


                /** if default home is not added with seq no */
                if (defaultReportURI == null)
                {
                    if (displayMenu.Count != 0)
                        defaultReportURI = displayMenu[0];
                    else
                        return null;
                }
            }

            setDefaultClientURI(clientId, defaultReportURI);
            /** Prepare Menu Object to return */
            return displayMenu;
        }

       

        [OutputCache(Duration = 1800)]
        public Dictionary<string, bool> getClientMenuDictionary(int clientId, int userId)
        {
          
            Dictionary<string, bool> tempMenuDict = new Dictionary<string, bool>();

            /**
             * Key => Display Lable , Value => List of Menu Items
             * 
             * **/
            using (DBModel db = new DBModel())
            {
                var menuList = db.view_user_menu.Where(a => a.client_id == clientId && a.user_id == userId)
                    .OrderBy(a => a.parent_module_id).ThenBy(a => a.seq_no).ToList<view_user_menu>();


                foreach (var menuItem in menuList) // Loop through List with foreach
                {
                    if(!tempMenuDict.ContainsKey(menuItem.uri))
                        tempMenuDict.Add(menuItem.uri, true);
                  
                }

                return tempMenuDict;

            }
            return null;
        }
    }
}