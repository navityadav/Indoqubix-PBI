using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System;
using System.Collections.Generic;


namespace SomatusAnalytics.Common
{
    public static class UserContextManager
    {
        
        private static Dictionary<string, UserContextModel> USER_CONEXT = new Dictionary< string, UserContextModel>();
       
        public static  List<MenuModel> getMenu()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].menu;
        }

        public static bool isDisplayMenu()
        {
            if (getMenu().Count < 2 && !isValidRole("ADMIN"))
                return false;
            return true;
        }

        public static List<PowerBIReportFilter> getPowerBIReportFilters()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].filter;
        }

        public static List<ClientModel> getClients()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].clients;
        }

        public static void setDefaultClientId(int clientId)
        {
             UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].clientId = clientId;
        }

        public static int getDefaultClientId()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].clientId;
        }

        public static int getSelectedClientId()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].selectedClientId;
        }

        public static Dictionary<string, bool> initMenuDictionary(string urserid, List<MenuModel> menus)
        {
            var menuDictionary = new Dictionary<string, bool>();
            foreach (var menu in menus) // Loop through List with foreach
            {
                /* check if menu key is laready prsent or not, to avoid duplicate URL's */   
                if(!menuDictionary.ContainsKey(menu.uri))
                    menuDictionary[menu.uri] = true;
            }
            return menuDictionary;
        }

        public static Boolean isMenuAccess(string uri)
        {
            var menuDictionary = UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].menuDictionary;
            if (menuDictionary == null)
            {
                menuDictionary = initMenuDictionary(UserContextManager.getUserKey(), UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].menu);
                UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].menuDictionary = menuDictionary;
            }

            if (menuDictionary.ContainsKey(uri))
                return true;

            return false;
        }

        public static string getRole()
        {
            if(UserContextManager.getUserKey()!=null && UserContextManager.USER_CONEXT.ContainsKey(UserContextManager.getUserKey())==true)
                return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].role;

            return null;
        }

        public static bool isValidRole(string role)
        {
            return getRole().Contains(role);
        }
        public static string getHomeURI()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].home;
        }

        public static Boolean isADUser()
        {
            return Settings.IS_AUTH_TYPE_AD;
        }

        public static Boolean isFirstTimeLogin()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].isFirstTimeLogin;
        }

        public static void setFirstTimeLogin(Boolean status )
        {
            
            UserContextModel context = UserContextManager.USER_CONEXT[UserContextManager.getUserKey()];
            context.isFirstTimeLogin = status;
            UserContextManager.USER_CONEXT.Remove(UserContextManager.getUserKey());
            UserContextManager.USER_CONEXT[UserContextManager.getUserKey()] = context;

        }

        public static string getUserKey()
        {
            if (!Settings.IS_AUTH_TYPE_AD)
            {
                var username = (string)System.Web.HttpContext.Current.Session["USER_ID"];
                return username;
            }
            else { 
                var userClaims = System.Security.Claims.ClaimsPrincipal.Current;
                var username = userClaims?.FindFirst("preferred_username")?.Value;
            
                return username;
            }
        }

        public static string getEmail()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].email;
        }

        public static string getUserName()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].displayName;
        }

        public static int getUserId()
        {
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].userId ;
        }


        public static Boolean isValidSession()
        {
            var userKey = UserContextManager.getUserKey();
            if (userKey!=null && UserContextManager.USER_CONEXT.ContainsKey(UserContextManager.getUserKey()))
            {
                return true;
            }
            else
            {
                return false; 
            }
        }

        public static int getClientId()
        {
            
            return UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].selectedClientId;
        }

        public static void setClientId(int clientId)
        {
            UserContextManager.USER_CONEXT[UserContextManager.getUserKey()].clientId= clientId;
        }

        public static void add(string userId, UserContextModel oContext)
        {
           
            if (UserContextManager.USER_CONEXT.ContainsKey(userId))
            {
                UserContextManager.USER_CONEXT.Remove(userId);
            }
           
            UserContextManager.USER_CONEXT.Add(userId, oContext);


        }

        public static void removeSession()
        {
            var userId = UserContextManager.getUserKey();

            if (userId!=null && !UserContextManager.USER_CONEXT.ContainsKey(userId))
            {
                UserContextManager.USER_CONEXT.Remove(UserContextManager.getUserKey());
            }
               
        }


        public static MenuModel initUserContextMenu( int clientId, int userId)
        {
            IQMenuService oMenu = new IQMenuService();
            UserContextModel oUserContextModel = UserContextManager.USER_CONEXT[UserContextManager.getUserKey()];

            oUserContextModel.selectedClientId = clientId;

            oUserContextModel.menu = oMenu.getClientMenu(clientId, userId);
            if (oUserContextModel.menu == null)
                return null;

            var defaultMenu = oUserContextModel.menu[0];// IQMenuService.getDefaultClientURI(clientId);
            oUserContextModel.defaultMenu = defaultMenu;
            oUserContextModel.defaultURI = defaultMenu.uri;

            if (defaultMenu.is_static)
                oUserContextModel.home = "/Static/content/" + defaultMenu.uri;    
            else
                oUserContextModel.home = "/SI/Report/" + defaultMenu.uri;

            oUserContextModel.menuDictionary = oMenu.getClientMenuDictionary(clientId, userId);
            UserContextManager.add(UserContextManager.getUserKey(), oUserContextModel);
            return defaultMenu;
        }

    }

}