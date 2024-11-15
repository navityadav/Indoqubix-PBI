using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Services
{
    public class AuthService
    {
        private static ac_system_setting systemSetting { get; set; }
        private const int serverId = 1;

        private void initAuthConfiguration()
        {
            using (DBModel db = new DBModel())
            {
                systemSetting = db.ac_system_setting.Where(a => a.server_id == serverId)
                   .FirstOrDefault<ac_system_setting>();
            }
        }

        internal bool changePassword(string loginId, UpdatePassword oUpdatePassword)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var userMaster = db.ac_user_master.Where(a => a.login_id == loginId && a.password == oUpdatePassword.password)
                       .FirstOrDefault<ac_user_master>();

                    userMaster.password = oUpdatePassword.newPassword;
                    userMaster.is_first_time_login = "N";
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        

        public bool isAuthenticatedUser(string loginid, string password)
        {
            bool IS_AUTH = false;
            initAuthConfiguration();
          
            if (localAuth(loginid, password))
                    IS_AUTH = true;

            /** If authorized get user Info */
            return IS_AUTH;


        }

        public ac_user_master getUserInfoByEmailVerification(string verificationCode)
        {
            try
            {
                using (DBModel db = new DBModel())
                {

                    var userMaster = db.ac_user_master.Where(a => a.email_verification_code == verificationCode)
                       .FirstOrDefault<ac_user_master>();

                    return userMaster;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return null;
            }
            
        }

        public ac_user_master getUserInfo(string loginid)
        {
            try
            {
                using (DBModel db = new DBModel())
                {

                    var userMaster = db.ac_user_master.Where(a => a.login_id == loginid && a.is_deleted == Messages.NO)
                       .FirstOrDefault<ac_user_master>();
                   
                    return userMaster;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return null;
            }
           
        }

        public ac_client_master getClientInfo(int clientId)
        {
            try
            {
                using (DBModel db = new DBModel())
                {

                    var client = db.ac_client_master.Where(a => a.client_id == clientId)
                       .FirstOrDefault<ac_client_master>();

                    return client;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return null;
            }
           
        }

        //To Be Updated - Sharvan
        public string getUserRole(int userId)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var roles = db.ac_user_role_mapping.Where(a => a.user_id == userId) .FirstOrDefault<ac_user_role_mapping>();

                    var systemRoles = UserServices.getRoles();
                    int roleId = roles.role_id;
                    string role = systemRoles[roleId];
                    return role;
                }
            }
            catch (Exception ex)
            {
                return "USER";
            }
        }



        public bool localAuth(string loginid, string password)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var hashPassword = Util.GetMD5Hash(password);


                    var userMaster  = db.ac_user_master.Where(a => a.login_id == loginid && a.password == hashPassword)
                       .FirstOrDefault<ac_user_master>();

                    if (userMaster != null)
                    {
                        return true; 

                    }
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            
        }

        /** User access log **/
        internal void saveAccessLogs(int userId, int clientId, HttpRequestBase request, string requestType)
        {
            if (!request.Url.LocalPath.Equals("/notification/latest"))
            { 

                AccessLog accessLog = new AccessLog();
                AuthService oAuth = new AuthService();

                accessLog.userBrowser = request.Browser.Browser;
                accessLog.userIP = request.UserHostAddress;
                accessLog.requestedURI = request.Url.LocalPath;
                if (string.IsNullOrEmpty(requestType))
                {
                    accessLog.requestType = getRequestType(accessLog.requestedURI);
                }
                else
                {
                    accessLog.requestType = requestType;
                }
                accessLog.requestedURI = request.Url.LocalPath.Replace("/SI/report/", "").Replace("/Static/content/", "");
               

                accessLog.userId = userId;
                accessLog.clientId = clientId;
                accessLog.accessTime = DateTime.UtcNow;
                oAuth.saveUserAccessLog(accessLog);
            }
        }

        protected string getRequestType(string request)
        {

            string requestType = "OT";

            if (request.ToUpper().Contains("STATIC"))
            {
                requestType = "SC";
            }
            else if (request.ToUpper().Contains("REPORT"))
            {
                requestType = "RP";
            }

            return requestType;

        }
        public bool saveUserAccessLog(AccessLog accessLog)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_user_access_log log = new ac_user_access_log();
                    log.client_id = accessLog.clientId;
                    log.user_id = accessLog.userId;
                    log.user_browser = accessLog.userBrowser;
                    log.user_ip = accessLog.userIP;
                    log.request_uri = accessLog.requestedURI;
                    log.request_type = accessLog.requestType;
                    log.accessed_on = DateTime.Now;
                    db.ac_user_access_log.Add(log);
                    db.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
          
        }

        

        public  bool matchPassword(string inputPassword, string encryptedPassword)
        {
            if (inputPassword.Equals(encryptedPassword))
                return true;
            else
                return false;

        }
        
        public bool matchPassword(string inputPassword, byte[] encryptedPassword)
        {
            System.Text.StringBuilder s = new System.Text.StringBuilder();
            var password = Util.GetMD5Hash(inputPassword);
            foreach (byte b in encryptedPassword)
            {
                s.Append(b.ToString("x2").ToLower());
            }
            if (password.Equals(s.ToString()))
                return true;
            else
                return false;
        }

       
        public void logout(object v)
        {
           // var authenticationContext = new AuthenticationContext(systemSetting.ad_authority_url);
            
        }
    

    }
}