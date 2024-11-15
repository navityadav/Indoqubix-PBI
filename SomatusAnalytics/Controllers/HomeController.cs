using System;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;


namespace SomatusAnalytics.Controllers
{
    [NoCache]
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            var result = new IndexConfig();
            // return checkUserAuthAndRedirect(result);
            if (Request.IsAuthenticated)
            {
                string preferredUserName = System.Security.Claims.ClaimsPrincipal.Current.FindFirst("preferred_username").Value;
                Console.WriteLine("PreferredUserName:" + preferredUserName);
                ActionResult ar = initSession(result, preferredUserName, true, null);
                return ar;
            }
            else
            {
                if (Common.UserContextManager.isValidSession() && UserContextManager.getHomeURI() != null)
                {
                    return Redirect(UserContextManager.getHomeURI());
                }
                result.error = "LOGIN";
                /** Redirect the user to the Login page */
                return View("index", result);
            }

        }

        private ActionResult initSession(IndexConfig result, string preferredUserName, Boolean isADUser, string redirect)
        {
            AuthService oAuth = new AuthService();
            UserServices us = new UserServices();

            if (preferredUserName == null || preferredUserName.Length <= 0)
            {
                result.error = "LOGIN";
                return View("index", result);
            }

            ac_user_master userMaster = oAuth.getUserInfo(preferredUserName);
            if (userMaster != null && userMaster.is_active.Equals("Y") && userMaster.is_deleted.Equals("N"))
            {
                //SAVE ACCESS LOGS
                oAuth.saveAccessLogs(userMaster.user_id, (int)userMaster.client_id, Request, "AS");

                if (!isADUser)
                    Session["USER_ID"] = preferredUserName;

                int clientId = (int)userMaster.client_id;
                int userId = userMaster.user_id;
                UserContextModel oUserContextModel = new UserContextModel();
                oUserContextModel.userId = userId;
                oUserContextModel.loginId = preferredUserName;
                oUserContextModel.displayName = userMaster.display_Name;
                oUserContextModel.email = userMaster.email;
                oUserContextModel.isADUser = isADUser;

                /** Get User Role */
                oUserContextModel.role = oAuth.getUserRole(userId);
                oUserContextModel.clients = us.getClientListByUser(userId);

                oUserContextModel.filter = us.getUserFilter(userId, clientId);

                oUserContextModel.selectedClientId = clientId;
                oUserContextModel.clientId = clientId;

                UserContextManager.add(preferredUserName, oUserContextModel);

                /** initialize User Menu */
                MenuModel defaultMenu = UserContextManager.initUserContextMenu(clientId, userId);

                Session["HomeURI"] = oUserContextModel.home;
                if (userMaster.is_first_time_login.Equals("Y"))
                {
                    return RedirectToAction("changePassword", "useraccess");
                }
                else
                {

                    if (redirect != null && redirect.Length > 1)
                        return Redirect(redirect);
                    else if (defaultMenu == null)
                    {
                        /** Error in case menu is not present 
                        ViewBag.Username = preferredUserName;
                        result.error = "NO_PERMISSION";
                        return View("index", result);
                        */

                        return invalidateUserSessionWithError(preferredUserName, "NO_PERMISSION");


                    }
                    else if (defaultMenu.is_static)
                        return RedirectToAction("content/" + defaultMenu.uri, "Static");
                    else
                        return RedirectToAction("Report/" + defaultMenu.uri, "SI");
                }
            }
            else
            {
                // var userClaims = User.Identity as System.Security.Claims.ClaimsIdentity;

                // The 'preferred_username' claim can be used for showing the username
                return invalidateUserSessionWithError(preferredUserName, "NO_PERMISSION");
            }


        }

        private ActionResult processLogin(IndexConfig result, string preferredUserName, Boolean isADUser, string redirect)
        {
            AuthService oAuth = new AuthService();
            UserServices oUserServices = new UserServices();
            // LoginModel loginModel = new LoginModel();

            if (preferredUserName == null || preferredUserName.Length <= 0)
            {
                result.error = "LOGIN";
                return View("index", result);
            }

            ac_user_master userMaster = oAuth.getUserInfo(preferredUserName);
            if (userMaster != null && userMaster.is_active.Equals("Y") && userMaster.is_deleted.Equals("N"))
            {
                //SAVE ACCESS LOGS
                //@TODO:MOve it after OTP verification
                oAuth.saveAccessLogs(userMaster.user_id, (int)userMaster.client_id, Request, "AS");

                if (!isADUser)
                {
                    Session["2FA_USER_ID"] = preferredUserName;

                    if (userMaster.display_Name != null || userMaster.display_Name != "")
                        Session["USER_DISPLAY_NAME"] = userMaster.display_Name;

                    //Adding Redirection URL to Session
                    Session["REDIRECT"] = redirect;
                    /** Redirect to 2FA authentication*/
                    Session["OTP_ATTEMPT"] = 0;
                    return RedirectToAction("auth2fa", "home");
                }
                else
                {
                    return RedirectToAction("", "home");
                }

            }
            else
            {
                // var userClaims = User.Identity as System.Security.Claims.ClaimsIdentity;

                // The 'preferred_username' claim can be used for showing the username
                return invalidateUserSessionWithError(preferredUserName, "NO_PERMISSION");
            }


        }

        /** Verify New User */
        public void send2faCode()
        {
            UserServices us = new UserServices();
            string otp = Util.generateOtp();
            Session["OTP"] = otp;
            us.sendOtp(Session["USER_DISPLAY_NAME"].ToString(), Session["2FA_USER_ID"].ToString(), otp);
        }

        public ActionResult auth2fa()
        {
            /** Verify User Source */
            if (Request.UrlReferrer == null && !(Request.UrlReferrer.AbsolutePath.CompareTo("/home/") == 0 || Request.UrlReferrer.AbsolutePath.CompareTo("/") == 0))
            {
                string preferredUserName = Common.UserContextManager.getUserKey();
                clearUserSession(preferredUserName);
                return RedirectToAction("/");
            }

            var result = new IndexConfig();
            if (null == Session["2FA_USER_ID"] || Session["2FA_USER_ID"].ToString() == "" || Session["OTP"] == "")
            {
                // ViewBag.Username = preferredUserName;
                Session["redirectURL"] = null;
                result.error = "NO_AUTH";
                return RedirectToAction("/");
            }
            else
            {
                int otpAtttempt = int.Parse(Session["OTP_ATTEMPT"].ToString());
                if (otpAtttempt == 3)
                {
                    /*Invalidate Session */
                    string preferredUserName = Common.UserContextManager.getUserKey();
                    clearUserSession(preferredUserName);


                    return OTPMaxAttemptError();
                }
                else
                {
                    UserServices us = new UserServices();
                    string otp = Util.generateOtp();
                    otp = "000000";
                    Session["OTP"] = otp;
                    Session["OTP_ATTEMPT"] = int.Parse(Session["OTP_ATTEMPT"].ToString()) + 1;
                    us.sendOtp(Session["USER_DISPLAY_NAME"].ToString(), Session["2FA_USER_ID"].ToString(), otp);
                    return View("auth2fa", result);
                }
            }
        }

        private void clearUserSession(string username)
        {
            if (username != null)
                System.Web.Security.FormsAuthentication.SetAuthCookie(username, false);

            if (!Settings.IS_AUTH_TYPE_AD)
                Session.Clear();
        }

        private ActionResult invalidateUserSessionWithError(string username, string error)
        {
            UserContextManager.removeSession();
            if (username != null)
                System.Web.Security.FormsAuthentication.SetAuthCookie(username, false);

            if (!Settings.IS_AUTH_TYPE_AD)
                Session.Clear();

            var result = new IndexConfig();
            result.error = error;
            return View("index", result);
        }


        public ActionResult ForgetPassword()
        {
            var result = new IndexConfig();
            return View(result);
        }
        public ActionResult ResetForgotPassword(UserModel oUserModel)
        {
            AuthService oAuth = new AuthService();
            UserServices us = new UserServices();
            ac_user_master um = oAuth.getUserInfo(oUserModel.loginId);

            if (um == null)
            {
                var result = new IndexConfig();
                result.error = "INVALID_USER";
                return View("ForgetPassword", result);
            }
            else if (um.login_type == Messages.USER_TYPE_AD)
            {

                var result = new IndexConfig();
                result.error = "AD_USER";
                return View("ForgetPassword", result);
            }
            else
            {
                //Reset Password. Send Mail and Redirect to Login Page
                string verificationCode = Util.generatedVerificationCode();
                us.forgetpasswordreset(um, verificationCode);
                var result = new IndexConfig();
                result.error = "RESET_PASSWORD_EMAIL";
                //      return RedirectToAction("changePassword", "useraccess");
                return View("index", result);

            }

        }
        public ActionResult Unauthorized()
        {
            var result = new IndexConfig();
            result.error = "NO_PERMISSION";
            return View("index", result);
        }

        public ActionResult OTPMaxAttemptError()
        {
            var result = new IndexConfig();
            result.error = "OTP_MAX_PERMISSION";
            return View("index", result);
        }

        /// <summary>
        /// Send an OpenID Connect sign-in request.
        /// Alternatively, you can just decorate the SignIn method with the [Authorize] attribute
        /// </summary>
        public ActionResult SignIn()
        {
            var redirectURL = "/";
            if (!Request.IsAuthenticated)
            {
                var rawURL = Request.RawUrl.ToString();

                if (rawURL.Contains("redirect="))
                {
                    redirectURL = rawURL.Split('=')[1];
                    redirectURL = HttpUtility.UrlDecode(redirectURL);
                }
                HttpContext.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = redirectURL },
                    OpenIdConnectAuthenticationDefaults.AuthenticationType);
                return null;
            }
            else
            {
                return RedirectToAction(redirectURL);
            }
        }

        [HttpPost]
        public ActionResult localSignIn(LoginModel login)
        {
            var result = new IndexConfig();
            result.isADUser = false;
            if (login.password == null)
            {
                result.error = "NO_AUTH";
                return View("index", result);
            }

            AuthService oAuth = new AuthService();
            if (oAuth.isAuthenticatedUser(login.username, login.password))
            {


                //      To be moved post OTP Validation
                ActionResult ar = processLogin(result, login.username, false, login.redirect);

                return ar;

            }

            /** Invalid User */
            //Save Access Log
            oAuth.saveAccessLogs(0, 0, Request, "AF");
            result.error = "NO_AUTH";
            return View("index", result);
        }


        [HttpPost]
        public ActionResult validate2fa(LoginModel login)
        {

            /** Verify User Source */
            if (Request.UrlReferrer == null && !(Request.UrlReferrer.AbsolutePath.CompareTo("/home/auth2fa") == 0))
            {
                return RedirectToAction("/");
            }


            var result = new IndexConfig();


            AuthService oAuth = new AuthService();
            try
            {

                var username = Session["2FA_USER_ID"].ToString();
                string redirect = null;
                if (null != Session["OTP"] && Session["OTP"].ToString() == login.otp)
                {
                    //      To be moved post OTP Validation
                    Session["OTP"] = "";
                    Session["USER_ID"] = username;

                    //Set Authentication Cookie and Web Token

                    System.Web.Security.FormsAuthentication.SetAuthCookie(username, true);

                    var principal = new ClaimsPrincipal(new ClaimsIdentity(null, "Basic"));
                    var isAuthenticated = principal.Identity.IsAuthenticated;

                    Claim oClaim = new Claim("preferred_username", username);

                    ClaimsIdentity oClaimsIdentity = new ClaimsIdentity();
                    oClaimsIdentity.AddClaim(oClaim);

                    System.Security.Claims.ClaimsPrincipal.Current.AddIdentity(oClaimsIdentity);


                    if (null != Session["REDIRECT"])
                    {
                        redirect = Session["REDIRECT"].ToString();
                    }
                    ActionResult ar = initSession(result, username, false, redirect);
                    return ar;
                }
            }
            catch (Exception e)
            {
                result.error = "OTP_EXPD";
                return View("index", result);
            }
            /** Invalid User */
            //Save Access Log
            oAuth.saveAccessLogs(0, 0, Request, "AF");
            result.error = "WRONG_OTP";
            return View("auth2fa", result);
        }



        /// <summary>
        /// Send an OpenID Connect sign-out request.
        /// </summary>
        public ActionResult SignOut(string p)
        {
            UserContextManager.removeSession();
            if (!Settings.IS_AUTH_TYPE_AD)
            {
                string preferredUserName = Common.UserContextManager.getUserKey();
                System.Web.Security.FormsAuthentication.SetAuthCookie(preferredUserName, false);
                Session.Clear();

                return RedirectToAction("/");
            }
            else
            {
                HttpContext.GetOwinContext().Authentication.SignOut(
                    OpenIdConnectAuthenticationDefaults.AuthenticationType,
                    CookieAuthenticationDefaults.AuthenticationType);
            }
            return Redirect("https://analytics.renaliq.com");
        }


    }
}