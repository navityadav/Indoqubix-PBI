using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.Owin.Security.Notifications;
using SomatusAnalytics.Common;
using SomatusAnalytics.Scheduler;
using Microsoft.Owin.Host.SystemWeb;

[assembly: OwinStartup(typeof(SomatusAnalytics.Startup))]

namespace SomatusAnalytics
{
    public class Startup
    {
        // RedirectUri is the URL where the user will be redirected to after they sign in.
        string authType = System.Configuration.ConfigurationManager.AppSettings["AuthType"];

        // The Client ID is used by the application to uniquely identify itself to Azure AD.
        string clientId = System.Configuration.ConfigurationManager.AppSettings["ClientId"];

        // RedirectUri is the URL where the user will be redirected to after they sign in.
        string redirectUri = System.Configuration.ConfigurationManager.AppSettings["RedirectUri"];

        // Tenant is the tenant ID (e.g. contoso.onmicrosoft.com, or 'common' for multi-tenant)
        static string tenant = System.Configuration.ConfigurationManager.AppSettings["Tenant"];

        // Authority is the URL for authority, composed by Microsoft identity platform endpoint and the tenant name (e.g. https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0)
        string authority = String.Format(System.Globalization.CultureInfo.InvariantCulture, System.Configuration.ConfigurationManager.AppSettings["Authority"], tenant);


        

        /// <summary>
        /// Configure OWIN to use OpenIdConnect 
        /// </summary>
        /// <param name="app"></param>
        public void Configuration(IAppBuilder app)
        {
            /** Set System authentication type */
            if (authType.Equals("LOCAL"))
                Settings.IS_AUTH_TYPE_AD = false;
            else
                Settings.IS_AUTH_TYPE_AD = true;

            /** Set Self Service report Service URL */
            Settings.FUNC_SELF_SERVICE_REPORT_EXPORT_URL = System.Configuration.ConfigurationManager.AppSettings["FUNC_SELF_SERVICE_REPORT_EXPORT_URL"];
            Settings.FUNC_POWERBI_REPORT_EXPORT_URL = System.Configuration.ConfigurationManager.AppSettings["FUNC_POWERBI_REPORT_EXPORT_URL"];
            if (System.Configuration.ConfigurationManager.AppSettings["FUNC_POWERBI_REPORT_DIRECT_DOWNLOAD"].Equals("0"))
            {
                Settings.FUNC_POWERBI_REPORT_DIRECT_DOWNLOAD = false;
            }
            else
            {
                Settings.FUNC_POWERBI_REPORT_DIRECT_DOWNLOAD = true;
            }
    

            Settings.KV_VAULT_URL = System.Configuration.ConfigurationManager.AppSettings["kvEndPoint"];
            Settings.KV_CLIENT_ID = System.Configuration.ConfigurationManager.AppSettings["kvClientId"];
            Settings.KV_CLIENT_SECRET = System.Configuration.ConfigurationManager.AppSettings["kvClientSecret"];
            Settings.ENV = System.Configuration.ConfigurationManager.AppSettings["env"];
            Settings.ENV_URL = System.Configuration.ConfigurationManager.AppSettings["env-url"];
            Settings.THEME = System.Configuration.ConfigurationManager.AppSettings["theme"];
            Settings.INSTANCE = System.Configuration.ConfigurationManager.AppSettings["instance"];
            Settings.EMAIL_TECH_SUPPORT = System.Configuration.ConfigurationManager.AppSettings["emailTechSupport"];
            Settings.HELP_URL = System.Configuration.ConfigurationManager.AppSettings["help-url"];
            Settings.TRY_NEW_EXP_HOME_LINK = System.Configuration.ConfigurationManager.AppSettings["tryNewExp"];
            Settings.SHOW_SPLASH_HOME_FLG = System.Configuration.ConfigurationManager.AppSettings["showSplashPage"].Equals("1");
            
            var status = Settings.initConfiguration();

            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

           // app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                CookieManager = new SystemWebCookieManager()
            });
            
            app.UseOpenIdConnectAuthentication(
            new OpenIdConnectAuthenticationOptions
            {
                // Sets the ClientId, authority, RedirectUri as obtained from web.config
                ClientId = clientId,
                Authority = authority,
                RedirectUri = redirectUri,
                CookieManager = new SystemWebCookieManager(),
                // PostLogoutRedirectUri is the page that users will be redirected to after sign-out. In this case, it is using the home page
                PostLogoutRedirectUri = redirectUri,
                Scope = OpenIdConnectScope.OpenIdProfile,
                // ResponseType is set to request the id_token - which contains basic information about the signed-in user
                ResponseType = OpenIdConnectResponseType.IdToken,
                // ValidateIssuer set to false to allow personal and work accounts from any organization to sign in to your application
                // To only allow users from a single organizations, set ValidateIssuer to true and 'tenant' setting in web.config to the tenant name
                // To allow users from only a list of specific organizations, set ValidateIssuer to true and use ValidIssuers parameter 
                TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false
                },
                // OpenIdConnectAuthenticationNotifications configures OWIN to send notification of failed authentications to OnAuthenticationFailed method
                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    AuthenticationFailed = OnAuthenticationFailed
                   
                }
            }
           
        );

            /** Start Subscribe Scheduler */
            JobScheduler.StartSubscriberScheduler();

            /** Start Power BI Report Downloader*/
            JobScheduler.StartPowerBiReportGenerationScheduler();


        }

        /// <summary>
        /// Handle failed authentication requests by redirecting the user to the home page with an error in the query string
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private Task OnAuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> context)
        {
            context.HandleResponse();
            context.Response.Redirect("/?errormessage=" + context.Exception.Message);
            return Task.FromResult(0);
        }
    }
}
