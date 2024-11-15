using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System.Web.Mvc;
using System.Web.Routing;

namespace SomatusAnalytics.Controllers
{
    [NoCache]
     public class UserAccessController : Controller
    {
        // GET: UserAccess
        public ActionResult Index()
        {
            return RedirectToAction(UserContextManager.getHomeURI());
           
        }

       public ActionResult ChangePassword()
        {
            var result = new ResetPassword();
            result.email = UserContextManager.getEmail();
            return View(result);

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult UpdatePassword(UpdatePassword oUpdatePassword)
        {
            if (oUpdatePassword.newPassword.Equals(oUpdatePassword.confirmpassword)){
                AuthService oAuth = new AuthService();
                var result = new IndexConfig();


                if (oAuth.localAuth(UserContextManager.getUserKey(), oUpdatePassword.password))
                {
                    if (Util.stringMatch(oUpdatePassword.newPassword, UserContextManager.getUserKey(), 4))
                    {
                        result.error = "ERROR_PASSWORD_HAS_USER";
                        return View("ChangePassword", result);
                    }
                    else if (oAuth.changePassword(UserContextManager.getUserKey(), oUpdatePassword))
                    {
                        UserContextManager.setFirstTimeLogin(false);
                        return Redirect(UserContextManager.getHomeURI());
                    }
                   result.error = "ERROR_IN_SAVING";
                    return View("ChangePassword", result);
                }
                else
                {
                    result.error = "INVALID_USER";
                    return View("ChangePassword", result);
                }

            }
            else
            {
                var result = new IndexConfig();
                result.error = "INVALID_NEW_PASSWORD";
                return View("ChangePassword", result);
            }

        }

        /** Verify New User */
        public ActionResult verify()
        {
            /**  Verify User Email and Redirect to Password Reset 
             * Sample URL : https://localhost:44368/useraccess/verify/qDxlhxujdS6jiIyG~sharvan23232
             * 
             */
            if (Request.Url.Segments.Length < 3) {
                return RedirectToAction("/", new RouteValueDictionary(
                            new { controller = "home", action = "/", errormessage = "Your account password reset request has expired" }));

            }

            var verificationCode = Request.Url.Segments[3];

            bool isVerificationCodeValid = Util.validateVerificationCode(verificationCode, 24*60*60 ) ;

            if (isVerificationCodeValid)
            {
                AuthService oAuth = new AuthService();
                ac_user_master userMaster = oAuth.getUserInfoByEmailVerification(verificationCode);
                if (userMaster != null)
                {
                    ResetPassword oResetPassword = new ResetPassword();
                    oResetPassword.displayName = userMaster.display_Name;
                    oResetPassword.verificationCode = verificationCode;
                    oResetPassword.email = userMaster.email;
                    return View(oResetPassword);
                }
            }

            return RedirectToAction("/", new RouteValueDictionary(
                        new { controller ="home", action = "/", errormessage = "Your account password reset request has expired" }));
        }




        public ActionResult ResetPassword(ResetPassword oResetPassword)
        {
            if(Util.stringMatch(oResetPassword.newPassword, oResetPassword.displayName,4)){
                oResetPassword.error = "ERROR_PASSWORD_HAS_USER";
                return View("verify", oResetPassword);
            }
            else if (oResetPassword.newPassword.Equals(oResetPassword.confirmpassword))
            {

                UserServices oUserServ = new UserServices();
                var login = oUserServ.resetPassword(oResetPassword.verificationCode, oResetPassword);
                if (login!=null)
                {
                    // UserContextManager.setFirstTimeLogin(false);
                    return Redirect("/");
                }
                else
                {
                    oResetPassword.error = "ERROR_IN_SAVING";
                    return View("verify", oResetPassword);
                }
             }
            else
            {
                oResetPassword.error = "INVALID_NEW_PASSWORD";
                return View("verify", oResetPassword);
            }

        }

        
    }
}