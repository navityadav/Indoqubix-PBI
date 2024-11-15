using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class ContactController : Controller
    {
      

        // GET: UserAccess
        public ActionResult Index()
        {
            return RedirectToAction(UserContextManager.getHomeURI());

        }


        // GET: ContactUs
        [HttpPost]
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public string contactUs(ContactModel cm)
        {
           UserServices us = new UserServices();
            AuthService oAuth = new AuthService();
            cm.user_id = UserContextManager.getUserId();
            cm.client_id = UserContextManager.getClientId();
                if (us.addContact(cm))
                    return "SUCCESS";
                else
                    return "FAIL";
           

        }

    }
}