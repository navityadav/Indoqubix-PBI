using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class ContentController : Controller
    {
      

        // GET: UserAccess
        public ActionResult Index()
        {
            return RedirectToAction(UserContextManager.getHomeURI());

        }


        [IQAuthrizationFilter("ADMIN")]
        public ActionResult list()
      
        {
            ContentServices oContentService = new ContentServices();
            UserServices oUserService = new UserServices();
            int clientId = Common.UserContextManager.getClientId();
            IQMenuService oMenu = new IQMenuService();
            ReportList oReportList = new ReportList();
            oReportList.clients = oUserService.getClientList();
            oReportList.templates = oContentService.getTemplates();
            oReportList.clientId = clientId;
            oReportList.roles = UserServices.getRoles();
            oReportList.menus =  oMenu.getClientMenu(clientId, 0);
            return View("list", oReportList);

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getRoleByMenu(MenuModel menu)
        {
            IQMenuService menuService = new IQMenuService();
            return JsonConvert.SerializeObject(menuService.getRoleByMenuId(menu.id, "GET_ROLE_ID"));
        }


        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getClientMenu(ClientModel cm)
        {
            UserServices oUserService = new UserServices();
            int clientId = Common.UserContextManager.getClientId();

            IQMenuService oMenu = new IQMenuService();
            List<MenuModel> oMenus = oMenu.getClientMenu(cm.clientId, 0);
            return JsonConvert.SerializeObject(oMenus);
        }


        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public string getMenuByList()
        {
            UserServices oUserService = new UserServices();
            int clientId = Common.UserContextManager.getClientId();

            IQMenuService oMenu = new IQMenuService();
            List<MenuModel> oMenus = oMenu.getClientMenu(1, 0);
            return JsonConvert.SerializeObject(oMenus);
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getReport(ReportModel rm)
        {
            ContentServices oContentService = new ContentServices();
            ReportModel oReport = oContentService.getReport(rm.clientId, rm.uri);
            return JsonConvert.SerializeObject(oReport);
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string addUpdMenuContent(MenuBuilder mb)
        {
            ContentServices oContentService = new ContentServices();
            string reqType = "";
            if (mb.id == -1)
            {
                reqType = "ADD";
            }
            else {
                reqType = "UPD";
            }
            if (oContentService.saveMenuContent(mb,reqType))
                return "SUCCESS";
            else
                return "FAIL";
        }

        // GET: Delete User
        [HttpPost]
        [IQAuthrizationFilter("ADMIN")]
        public string deleteContent(MenuBuilder mb)
        {
            ContentServices oContentService = new ContentServices();
            if (oContentService.delMenuContent(mb))
                return "SUCCESS";
            else
                return "FAIL";

        }


        // GET: Check URI Exist
        [HttpPost]
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public string isURIAvailibleForClient(MenuBuilder mb)
        {
            var clientId =mb.clientId;
            var uri = Request.Form[0];

            mb.uri = uri;

            var result = new Dictionary<string,string>();

            ContentServices oContentService = new ContentServices();
            if (mb.uri == null || mb.uri.Equals(""))
            {
                return "false";
            }

            if (oContentService.isURIAvailibleForClient(mb))
                return "true";
            else
                return "false";
        }


        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getPlaceHolders(ReportModel rm)
        {
            ContentServices oContentService = new ContentServices();
            List<StaticContentBlocks> oPlaceHolders = oContentService.getPlaceHolders(rm.clientId, rm.uri);
            return JsonConvert.SerializeObject(oPlaceHolders);
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getPlaceHolderTemplates(ReportModel rm)
        {
            ContentServices oContentService = new ContentServices();
            List<StaticContentBlocks> oPlaceHolders = oContentService.getPlaceHolderTemplates(rm.title,"TEMPLATE");
            return JsonConvert.SerializeObject(oPlaceHolders);
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        [HttpPost]
        public string getPlaceHolderTemplateNames(ReportModel rm)
        {
            ContentServices oContentService = new ContentServices();
            List<StaticContentBlocks> oPlaceHolders = oContentService.getPlaceHolderTemplates(rm.title,"TEMPLATE_NAME");
            return JsonConvert.SerializeObject(oPlaceHolders);
        }

    }
}