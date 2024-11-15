using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Services;
using System;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class StaticController : Controller
    {
        // GET: Static
        private const string HOLDER_USER_NAME = "__USER_NAME__";

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
      
        public ActionResult Content()
        {

            if (Request.Url.Segments.Length < 4)
            {
                return View("DynamicErrorMessage", Common.Messages.Error404());
            }
            else
            {
                var contentURI = Request.Url.Segments[3];
                
                int clientId = Common.UserContextManager.getClientId();

                try
                {
                    StaticContentService oStaticContentService = new StaticContentService();
                    var oStaticContent = oStaticContentService.getStaticConent(clientId, contentURI);

                    if(oStaticContent == null || oStaticContent.content==null)
                    {
                        return View("DynamicErrorMessage", Common.Messages.Error404(oStaticContent.ErrorMessage));
                    }

                    
                    oStaticContent.content = oStaticContent.content.Replace(HOLDER_USER_NAME, Common.UserContextManager.getUserName());
                    return View(oStaticContent);
                    
                }
                catch (Exception ex)
                {
                    return View("DynamicErrorMessage", Common.Messages.Exception(ex));
                }

            }
        }

    }
}