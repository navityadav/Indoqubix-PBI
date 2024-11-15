using Newtonsoft.Json;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class SubscribeController : Controller
    {

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getStatus(SubscribeModel sm)
        {
            int clientId = Common.UserContextManager.getClientId();

            int userId = Common.UserContextManager.getUserId();
            SubscribeService oSubscribeService = new SubscribeService();
            var subscription = oSubscribeService.getReportSubscriptionStatus(userId, clientId, sm.reportId,sm.reportType);
            return JsonConvert.SerializeObject(subscription); 
        }


        // GET: Subscribe
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string report(SubscribeModel sm)
        {
            if (sm.frequency == null)
                sm.frequency = "";
            int clientId = Common.UserContextManager.getClientId();
            
            int userId = Common.UserContextManager.getUserId();

            SubscribeService oSubscribeService = new SubscribeService();
            if(oSubscribeService.saveRequest(userId, sm, clientId))
                return "SUCCESS";
            else
                return "FAIL";

        }

     
    }
}