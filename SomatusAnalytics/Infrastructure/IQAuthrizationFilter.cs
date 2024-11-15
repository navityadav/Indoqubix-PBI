using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;


namespace SomatusAnalytics.Infrastructure
{
    public class IQAuthrizationFilter : AuthorizeAttribute, IAuthorizationFilter
    {
        public IQAuthrizationFilter(params string[] roles)
        {
        
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {

            bool authorize = false;
            AuthService oAuth = new AuthService();
            if (Common.UserContextManager.isValidSession())
            {
                authorize = true;
                oAuth.saveAccessLogs(Common.UserContextManager.getUserId(), Common.UserContextManager.getClientId(), httpContext.Request, "");
            }
            else
            {
                var userClaims = System.Security.Claims.ClaimsPrincipal.Current;
                var username = userClaims?.FindFirst("preferred_username")?.Value;
                if (username == null)
                {
                    oAuth.saveAccessLogs(0, 0, httpContext.Request, "AF");
                    return false;
                }
                ac_user_master userMaster = oAuth.getUserInfo(username);
                if (userMaster != null && userMaster.is_active.Equals("Y") && userMaster.is_deleted.Equals("N"))
                {
                    UserServices us = new UserServices();

                    int clientId = (int)userMaster.client_id;
                    int userId = (int)userMaster.user_id;
                    UserContextModel oUserContextModel = new UserContextModel();
                    oUserContextModel.userId = userId;
                    oUserContextModel.loginId = username;
                    oUserContextModel.displayName = userMaster.display_Name;
                    oUserContextModel.email = userMaster.email;
                   
                    if (userMaster.login_type!=null && userMaster.login_type.Equals("AD"))
                        oUserContextModel.isADUser = true;
                    else
                        oUserContextModel.isADUser = false;

                    /** Get User Role */
                    oUserContextModel.role = oAuth.getUserRole(userId);
                    oUserContextModel.clients = us.getClientListByUser(userId);

                    oUserContextModel.filter = us.getUserFilter(userId, clientId);

                    oUserContextModel.selectedClientId = clientId;
                    oUserContextModel.clientId = clientId;

                    UserContextManager.add(username, oUserContextModel);

                    /** initialize User Menu */
                    MenuModel defaultMenu = UserContextManager.initUserContextMenu(clientId, userId);

 
                    if (userMaster.is_first_time_login.Equals("Y"))
                        oUserContextModel.isFirstTimeLogin = true;
                    else
                        oUserContextModel.isFirstTimeLogin = false;
                   
                    if (defaultMenu == null)
                    {
                        /** Error in case menu is not present */
                        oAuth.saveAccessLogs(userId, clientId, httpContext.Request, "INVALID MENU");
                        return false;
                    }

                    authorize = true;
                    oAuth.saveAccessLogs(userId,clientId, httpContext.Request,"AS-FILTER");

                }
                else
                {
                    authorize = false;
                    oAuth.saveAccessLogs(0, 0, httpContext.Request, "AF");
                }
            }


            return authorize;
        }

       

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            var rawURL = filterContext.HttpContext.Request.RawUrl.ToString();
            filterContext.Result = new RedirectToRouteResult(
               new RouteValueDictionary(
                    new { controller = "home", action = "/", redirect = rawURL }));
           
        }
    }  
    
}