using Microsoft.Azure.KeyVault;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SomatusAnalytics.Common
{
    public static  class Settings
    {
        public static string KV_VAULT_URL { get; set; }
        public static  string KV_CLIENT_ID { get; set; }
        public static  string KV_CLIENT_SECRET { get; set; }
        public static  string ENV { get; set; }
        public static string ENV_URL { get; set; }

        public static string HELP_URL { get; set; }

        public static string INSTANCE { get; internal set; }

        public static string EMAIL_TECH_SUPPORT { get; internal set; }
        public static string THEME { get; internal set; }
        public static string FUNC_POWERBI_REPORT_EXPORT_URL { get; set; }
        public static string FUNC_SELF_SERVICE_REPORT_EXPORT_URL { get; set; }

        public static Boolean FUNC_POWERBI_REPORT_DIRECT_DOWNLOAD { get; set; }

        public static string STORAGE_CONTAINER { get; set; }
        public static string STORAGE_ACCOUNT_NAME { get; set; }
        public static string STORAGE_ACCOUNT_KEY { get; set; }

        /** Email Setting */
        public static string EMAIL_FROM { get; internal set; }
        public static string EMAIL_FROM_NAME { get; internal set; }
        public static string EMAIL_USERNAME { get; internal set; }
        public static string EMAIL_PASSWORD { get; internal set; }
        public static string EMAIL_PORT { get; internal set; }
        public static string EMAIL_SMTP { get; internal set; }
        public static Boolean IS_AUTH_TYPE_AD { get; internal set; }

        public static string TRY_NEW_EXP_HOME_LINK { get; set; }
        public static Boolean SHOW_SPLASH_HOME_FLG { get; internal set; }
        public static Dictionary<int, String> SYSTEM_ROLES { get; set; }
        /**
        * Initialize Key Vault and Set All Properties
        * */

        public static async Task<Boolean> initConfiguration()
        {
            try
            {
                KeyVaultClient kvClient = new KeyVaultClient(async (authority, resource, scope) =>
                {
                    var adCredential = new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(Common.Settings.KV_CLIENT_ID, Common.Settings.KV_CLIENT_SECRET);
                    var authenticationContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority, null);
                    return (await authenticationContext.AcquireTokenAsync(resource, adCredential)).AccessToken;
                });

                /** Get Support Email Id */
                Settings.EMAIL_TECH_SUPPORT = await GetSecret(kvClient, "email-tech-support");

                if (ENV.Equals("UAT"))
                {
                    Console.WriteLine("Running Function in UAT Env");
                    STORAGE_CONTAINER = await GetSecret(kvClient, "storage-container-uat");
                    
                }
                else
                {
                    Console.WriteLine("Running Function in Production Env");
                    STORAGE_CONTAINER = await GetSecret(kvClient, "storage-container");
                }

                // Set Storage account credentials
                STORAGE_ACCOUNT_NAME = await GetSecret(kvClient, "storage-account-name");
                STORAGE_ACCOUNT_KEY = await GetSecret(kvClient, "storage-account-key");
               
                /** Set Email Setting */
                EMAIL_FROM = await GetSecret(kvClient, "email-from");
                EMAIL_FROM_NAME = await GetSecret(kvClient, "email-from-name");
                EMAIL_USERNAME = await GetSecret(kvClient, "email-username");
                EMAIL_PASSWORD = await GetSecret(kvClient, "email-password");
                EMAIL_SMTP = await GetSecret(kvClient, "email-smtp");
                EMAIL_PORT = await GetSecret(kvClient, "email-port");

                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }

        //Get Key Vault Secret Value
        public static async Task<string> GetSecret(KeyVaultClient kvClient, string secretName)
        {
            var keyvaultSecret = await kvClient.GetSecretAsync(Common.Settings.KV_VAULT_URL + "/Secrets/" + secretName);
            return keyvaultSecret.Value;
        }
    }
}