using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class IssueController : Controller
    {
        // GET: Subscribe
        [HttpPost]
        public string report(IssueModel sm)
        {
            if (sm.frequencyOptions == null)
                sm.frequencyOptions = "";
            int clientId = Common.UserContextManager.getClientId();
            
            int userId = Common.UserContextManager.getUserId();

            IssueService ss = new IssueService();
            if(ss.saveRequest(userId, sm, clientId))
                return "SUCCESS";
            else
                return "FAIL";

        }
    }
}