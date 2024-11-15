using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using SomatusAnalytics.Common;
using SomatusAnalytics.Services;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;


namespace SomatusAnalytics.Controllers
{
    public class PublishController : Controller
    {
        public ActionResult sku()
        {
            /** Check AUTH TYPE */
            Boolean IS_AUTH = true;
            if (Settings.IS_AUTH_TYPE_AD)
            {
                if (!Request.IsAuthenticated)
                {
                    IS_AUTH = false;
                    var rawURL = Request.RawUrl.ToString();
                    HttpContext.GetOwinContext().Authentication.Challenge(
                        new AuthenticationProperties { RedirectUri = rawURL },
                        OpenIdConnectAuthenticationDefaults.AuthenticationType);
                }
            }
            else
            {
                if (!Common.UserContextManager.isValidSession())
                {
                    IS_AUTH = false;
                    var rawURL = Request.RawUrl.ToString();
                    return RedirectToAction("/", new RouteValueDictionary(
                            new { controller ="home", action = "/", redirect = rawURL }));

                    //return RedirectToAction("/", "home");

                }
            }


            if (IS_AUTH)
            {
                /** Redirect to required report */
                PublishService oPublishService = new PublishService();
                var reportURI = Request.Url.Segments[3];
                int userId = Common.UserContextManager.getUserId();
                var reportUri  = oPublishService.getReportInfo(userId, reportURI);

                if (reportUri.Equals(Messages.E_404))
                {
                    return View("DynamicErrorMessage", Common.Messages.Error404());
                }
                return Redirect(reportUri);


            }
            //return View("DynamicErrorMessage", Common.Messages.unAuthorizedAccess());
            return View("DynamicErrorMessage", Common.Messages.ReportError404());
        }
    }
}