using Newtonsoft.Json;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Services;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{

    public class NotificationController : Controller
    {

        /** Method to  */
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string latest()
        {
            /** Get User Id **/
            int userId = Common.UserContextManager.getUserId();

            ReportExportService oReportExportService = new ReportExportService();
            int clientId = Common.UserContextManager.getClientId();
            return JsonConvert.SerializeObject(oReportExportService.getLatestReportExportRequest(userId));
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public void markasread()
        {
            /** Get User Id **/
            int userId = Common.UserContextManager.getUserId();

            ReportExportService oReportExportService = new ReportExportService();
            oReportExportService.markasread(userId);

        }
    }
}