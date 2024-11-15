using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class UserController : Controller
    {
      

        // GET: UserAccess
        public ActionResult Index()
        {
            return RedirectToAction(UserContextManager.getHomeURI());

        }


        [IQAuthrizationFilter("ADMIN")]
        public ActionResult list()
      
        {
            UserServices oUserService = new UserServices();
            /** User List */
            UserLists users = new UserLists();

            List<UserModel> oUsers = oUserService.getUserList();
            users.users = oUsers;
            users.clients = oUserService.getClientList();
            users.roles = UserServices.getRoles();

            return View("list", users);

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getClientFilters(ClientModel cm)
        {
            int clientId = cm.clientId;

            UserServices oUserService = new UserServices();
            var clientFilters = oUserService.getClient(clientId).clientReportFilters;
            return clientFilters;
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getFilterMappings(FilterMappingModel fm)
        {
            int clientId = fm.clientId;
            int userId = fm.userId;
            UserServices oUserService = new UserServices();
            var clientFilters = oUserService.getUserReportFilterMappings(userId,clientId);
            return JsonConvert.SerializeObject(clientFilters);
        }


        // GET: AddNewUser
        [HttpPost]
        [IQAuthrizationFilter("ADMIN")]
        public string addUser(UserModel um)
        {
            UserServices us = new UserServices();
            AuthService oAuth = new AuthService();
           
            //Check if loginID already exists
            if (oAuth.getUserInfo(um.loginId) == null)
            {
                if (us.addUser(um))
                    return "SUCCESS";
                else
                    return "FAIL";
            }
            else {
                return "EXIST_FAIL";
            }

        }

        // POST: Update User
        [HttpPost]
        [IQAuthrizationFilter("ADMIN")]
        public string updateUser(UserModel um)
        {
            UserServices us = new UserServices();
            if (us.updateUser(um))
                return "SUCCESS";
            else
                return "FAIL";

        }

        // GET: Delete User
        [HttpPost]
        [IQAuthrizationFilter("ADMIN")]
        public string delete()
        {
            if (Request.Url.Segments.Length < 3)
            {
                return "FAIL";
            }

            var userid = Request.Url.Segments[3];

            UserServices us = new UserServices();
            if (us.delUser(userid))
                return "SUCCESS";
            else
                return "FAIL";

        }

        // POST: Update Client
        [HttpPost]
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public string updateclient(UserModel um)
        {
            int clientId = um.clientId;
            string methodType = um.clientDomain;
            UserServices us = new UserServices();
            if (us.updateClient(clientId, methodType))
            {
                return "SUCCESS";
            }
            else
            {
                return "FAIL";
            }
        }
    }
}