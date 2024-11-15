using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace SomatusAnalytics.Services
{
    public class UserServices
    {

        [OutputCache(Duration = 180000)]
        public List<ClientModel> getClientList()
        {   
            using (DBModel db = new DBModel())
            {
                List<ClientModel> clients = new List<ClientModel>();
                List<ac_client_master>  oClientLists = db.ac_client_master.ToList<ac_client_master>();
                foreach (var client in oClientLists) // Loop through List with foreach
                {
                    clients.Add(getClientModel(client));
                }
                return clients;
            }
        }

        [OutputCache(Duration = 180000)]
        public List<ClientModel> getClientListByUser(int userId)
        {
            using (DBModel db = new DBModel())
            {
                List<ClientModel> clients = new List<ClientModel>();

                var oClientLists = (from cm in db.ac_client_master
                                    join cum in db.ac_client_user_mapping on cm.client_id equals cum.client_id
                                    where cum.user_id == userId
                                    orderby cm.client_name descending
                                    select new
                                    {
                                        cm.client_id,
                                        cm.client_name
                                    }
                ).ToList();

                foreach (var client in oClientLists) // Loop through List with foreach
                {
                    ClientModel oClient = new ClientModel();
                    oClient.clientId = client.client_id;
                    oClient.clientName = client.client_name;
                    clients.Add(oClient);
                }
                return clients;
            }
        }

        [OutputCache(Duration = 180000)]
        public List<ac_user_report_filter_mapping> getUserReportFilterMappings(int userId,int clientId)
        {
            using (DBModel db = new DBModel())
            {
                List<ac_user_report_filter_mapping>  oUserReportFilterMappings = db.ac_user_report_filter_mapping.Where(a => a.user_id == userId && a.client_id == clientId).ToList<ac_user_report_filter_mapping>();
                return oUserReportFilterMappings;
            }
        }

        [OutputCache(Duration = 180000)]
        public List<PowerBIReportFilter> getUserFilter(int userId, int clientId)
        {
            List<PowerBIReportFilter> oFilterMapping = new List<PowerBIReportFilter>();
            using (DBModel db = new DBModel())
            {
                List<ac_user_report_filter_mapping> oUserReportFilterMappings = db.ac_user_report_filter_mapping.Where(a => a.user_id == userId && a.client_id == clientId).ToList<ac_user_report_filter_mapping>();

                foreach (var filter in oUserReportFilterMappings) // Loop through List with foreach
                {
                    PowerBIReportFilter oPowerBIReportFilter = new PowerBIReportFilter();
                    if (!filter.filter_key.Contains(':'))
                    {
                        continue;
                    }
                    var tableInfo = filter.filter_key.Split(':');
                    oPowerBIReportFilter.table = tableInfo[0];
                    oPowerBIReportFilter.column = tableInfo[1];
                    oPowerBIReportFilter.value = filter.filter_value;
                    oFilterMapping.Add(oPowerBIReportFilter);
                }
                return oFilterMapping;
            }
        }

        public ClientModel getClient(int clientId)
        {
            using (DBModel db = new DBModel())
            {
                var client = db.ac_client_master.Where(a => a.client_id == clientId).FirstOrDefault<ac_client_master>();
                ClientModel oClient = getClientModel(client);
                return oClient;
            }
        }

        private ClientModel getClientModel(ac_client_master client)
        {
            ClientModel oClient = new ClientModel();
            oClient.clientId = client.client_id;
            oClient.clientDomain = client.client_domain;
            oClient.clientName = client.client_name;
            oClient.clientReportFilters = client.client_report_filters;
            return oClient;
        }


        [OutputCache(Duration = 180000)]
        public static Dictionary<int,String> getRoles()
        {
            Dictionary<int, String> roles = new Dictionary<int, String>();
            using (DBModel db = new DBModel())
            {
                List<ac_role_master>  oRolesList = db.ac_role_master.Where(a => a.is_active.Equals("Y")).ToList<ac_role_master>();
                foreach (var role in oRolesList) // Loop through List with foreach
                {
                    roles.Add(role.role_id, role.role);
                }
            }
            return roles;
        }

        [OutputCache(Duration = 180000)]
        public List<UserModel>  getUserList()
        {
            /** Get User Role Mapping */
            var userRoleMapping = initUserRoleMapping();

            /**
             * Key => Display Lable , Value => List of Menu Items
             * 
             * **/
            using (DBModel db = new DBModel())
            {
              
                var oUserLists = (from cm in db.ac_client_master
                            join um in db.ac_user_master on cm.client_id equals um.client_id where um.is_deleted=="N"
                                  orderby  um.updated_on descending
                                  select new {
                             um.user_id,
                             um.client_id,
                             um.login_id,
                             cm.client_name,
                             um.display_Name,
                             um.email,
                             um.mobile_no,
                             um.is_active,
                             um.is_deleted,
                             um.login_type
                         } 
                ).ToList();


                /* Prepare User List */
                List<UserModel> userLists = new List<UserModel>();

               
                foreach (var user in oUserLists) // Loop through List with foreach
                {
                    UserModel oUser = new UserModel();
                    oUser.userId = user.user_id;
                    oUser.displayName = user.display_Name;
                    oUser.loginId = user.login_id;
                    oUser.clientId = (int)user.client_id;
                    oUser.email = user.email;
                    oUser.mobile = user.mobile_no;
                    oUser.isActive = user.is_active;
                    oUser.isDeleted = user.is_deleted;
                    oUser.loginType = user.login_type;
                    oUser.clientName = user.client_name;
                    oUser.clientIds = getClientByUsrId(oUser, "GET_CLIENT_ID");
                    oUser.clients = getClientByUsrId(oUser, "");
                    // oUser.role = getRoleByUsrId(oUser.userId, "");
                    //  oUser.roleIds =getRoleByUsrId(oUser.userId,"GET_ROLE_ID");

                    if (userRoleMapping != null) { 
                        Dictionary<int, string> userRoleDict;
                        userRoleMapping.TryGetValue(oUser.userId, out userRoleDict);

                        if (userRoleDict != null)
                        {
                            oUser.role = userRoleDict;
                            oUser.roleIds = userRoleDict.Keys.ToArray<int>();
                        }
                    }
                    userLists.Add(oUser);
                }
                return userLists;
            }
        }

        private Dictionary<int, Dictionary<int, string>> initUserRoleMapping()
        {
            try
            {
                Dictionary<int, Dictionary<int, string>> userRoleMapping = new Dictionary<int, Dictionary<int, string>>();
                using (DBModel db = new DBModel())
                {
                    Dictionary<int, string> roles = new Dictionary<int, string>();
                    List<ac_role_master> oRolesList = db.ac_role_master.Where(a => a.is_active.Equals("Y")).ToList<ac_role_master>();
                    foreach (var role in oRolesList) // Loop through List with foreach
                    {
                        roles.Add(role.role_id, role.role);
                    }

                    var rolesMappings = db.ac_user_role_mapping.OrderBy(a => a.user_id).ToList<ac_user_role_mapping>();
                    
                    foreach (var role in rolesMappings) // Loop through List with foreach
                    {

                        if (userRoleMapping.ContainsKey(role.user_id))
                        {
                            Dictionary<int, string> userRoleDict ;
                            userRoleMapping.TryGetValue(role.user_id,out userRoleDict);
                            if (!userRoleDict.ContainsKey(role.role_id))
                            {
                                string roleName;
                                roles.TryGetValue(role.role_id, out roleName);
                                if (roleName == null || roleName.Length < 1)
                                    continue;

                                userRoleDict.Add(role.role_id, roleName);
                            }
                            userRoleMapping.Remove(role.user_id);
                            userRoleMapping.Add(role.user_id, userRoleDict);
                        } else {
                            string roleName;
                            roles.TryGetValue(role.role_id, out roleName);
                            if (roleName == null || roleName.Length < 1)
                                continue;

                            Dictionary<int, string> userRoleDict = new Dictionary<int, string>();
                            

                            userRoleDict.Add(role.role_id, roleName);
                            userRoleMapping.Add(role.user_id, userRoleDict);
                        }
                    }
                    return userRoleMapping;


                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return null;
            }

        }

        public dynamic getClientByUsrId(UserModel um, string reqType)
        {
            /*
             * Fetch all client user mappings based on userId from ac_client_user_mapping table and if no mapping exist, return default client id and name.
             * If Request Type is GET_CLIENT_ID then only returns Keys.
             */
            try
            {
                using (DBModel db = new DBModel())
                {
                    int userId = um.userId;
                    var clients = db.ac_client_user_mapping.Where(a => a.user_id == userId).ToList<ac_client_user_mapping>();
                    Dictionary<int, String> usrClientMappings = new Dictionary<int, string>();
                    UserServices us = new UserServices();
                    var systemClients = us.getClientList();
                    if (clients!=null && clients.Count >0)
                    {
                        foreach (var cm in clients) // Loop through List with foreach
                        {
                            if (!usrClientMappings.ContainsKey((int)cm.client_id))
                            {
                                usrClientMappings.Add((int)cm.client_id, systemClients.Find(x => x.clientId == cm.client_id).clientName);
                            }
                          

                        }
                        
                    }
                    else {
                        usrClientMappings.Add(um.clientId, um.clientName);
                     
                    }

                    if (reqType == "GET_CLIENT_ID")
                    {
                        return usrClientMappings.Keys.ToArray<int>();
                    }

                    return usrClientMappings;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                if (reqType == "GET_CLIENT_ID")
                    return 0;
                else
                    return "Client Not Mapped";
            }
        }


        public dynamic getRoleByUsrId(int userId,string reqType)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var roles = db.ac_user_role_mapping.Where(a => a.user_id == userId).ToList<ac_user_role_mapping>();
                    Dictionary<int, String> userRoleMappings = new Dictionary<int, string>();
                    var systemRoles = UserServices.getRoles();
                    foreach (var role in roles) // Loop through List with foreach
                    {
                        if (!userRoleMappings.ContainsKey(role.role_id)) { 
                            userRoleMappings.Add(role.role_id, systemRoles[role.role_id]);
                        }
                    }
                    if (reqType == "GET_ROLE_ID")
                    {
                        return userRoleMappings.Keys.ToArray<int>();
                    }
                    return userRoleMappings;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                if (reqType == "GET_ROLE_ID")
                    return 0;
                else
                    return "Role Not Assigned";
            }
        }

        internal bool addUser(UserModel um)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_user_master user = new ac_user_master();
                    user.login_id = um.loginId;
                    user.login_type = um.loginType;
                    user.client_id = um.clientId;
                    user.email = um.email;
                    user.mobile_no = um.mobile;
                    user.display_Name = um.displayName;
                    user.updated_by = UserContextManager.getUserName();
                    user.updated_on = DateTime.Now;
                    if (user.login_type == Messages.USER_TYPE_AD)
                    {
                        user.is_active = Messages.YES;
                        user.is_deleted = Messages.NO;
                        user.is_first_time_login = Messages.NO;
                        user.email_verification_code = "";
                    }
                    else
                    {
                        user.is_active = Messages.NO;
                        user.is_deleted = Messages.NO;
                        user.is_first_time_login = Messages.NO;
                        user.email_verification_code = Util.generatedVerificationCode();
                    }

                    db.ac_user_master.Add(user);
                    db.SaveChanges();
                    //Add Client Mappings
                    addClientMappings(user.user_id, um.clientIds);
                    //Add Role Mappings
                    //Add role as specified
                    addRoles(user.user_id, um.roleIds);
                    

                    //Add Filter Mappings..
                    updateUserFilterMappings(um.userId, um.clientId, um.filterMappings);

                    Dictionary<string, string> emailContent = new Dictionary<string, string>();
                    emailContent.Add("__USERNAME__", um.displayName);
                    emailContent.Add("__BASE_PATH__", Util.GetBaseUrl(um.clientId));

                    if (user.login_type != Messages.USER_TYPE_AD)
                    {
                        /** Send Email for Verification */
                        var emailVerificationCode = user.email_verification_code;
                        // Send Verification Email
                        emailContent.Add("__VERIFICATION_CODE__", emailVerificationCode);
                       
                      SendMail.Send(Messages.TEMPLATE_EMAIL_VERIFICATION, um.email, emailContent);
                    }
                    else
                    {
                        
                     SendMail.Send(Messages.TEMPLATE_EMAIL_WELCOME, um.email, emailContent);
                    }
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }
            return true;
        }

        internal bool updateUser(UserModel um)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var user = db.ac_user_master.Where(a => a.user_id == um.userId)
                        .FirstOrDefault<ac_user_master>();
                    user.login_id = um.loginId;
                    user.login_type = um.loginType;
                    user.client_id = um.clientId;
                    user.email = um.email;
                    user.mobile_no = um.mobile;
                    user.display_Name = um.displayName;
                    user.updated_by = UserContextManager.getUserName();
                    user.updated_on = DateTime.Now;
                    db.SaveChanges();
                    //Save User

                    //Save Updated Client User Mapping - IF condition for any change in mappings to be added.
                    if (um.clientIds != null)
                    {
                        //DELETE  ALL existing client user mappings
                        var clientMappings = db.ac_client_user_mapping.Where(a => a.user_id == um.userId).ToList<ac_client_user_mapping>();
                        foreach (ac_client_user_mapping mapping in clientMappings)
                        {
                            db.ac_client_user_mapping.Remove(mapping);
                        }
                        db.SaveChanges();
                        //Add clientMappings as specified
                        addClientMappings(user.user_id, um.clientIds);
                    }

                    //Save Updated Role Mapping - IF condition for any change in role to be added.
                    if (um.roleIds != null)
                    {
                        //DELETE  ALL existing roles
                        var roles = db.ac_user_role_mapping.Where(a => a.user_id == um.userId).ToList<ac_user_role_mapping>();
                        foreach (ac_user_role_mapping role in roles) {
                            db.ac_user_role_mapping.Remove(role);
                        }
                        db.SaveChanges();
                        //Add role as specified
                        addRoles(user.user_id, um.roleIds);
                    }


                  

                    //Update Filter Mappings.
                    updateUserFilterMappings(um.userId, um.clientId, um.filterMappings);
                    
                    Dictionary<string, string> emailContent = new Dictionary<string, string>();
                    // Send Mail to User for Account Update - Template to be added.
                    emailContent.Add("__USERNAME__", um.displayName);
                    emailContent.Add("__BASE_PATH__", Util.GetBaseUrl(um.clientId));
                   // JIRA ID PE-103 - Disable Email    
                  //   SendMail.Send(Messages.TEMPLATE_EMAIL_UPDATE_USER, um.email, emailContent);
                     
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }

            return true;

        }
        internal void updateUserFilterMappings(int userId,int clientId, List<ac_user_report_filter_mapping> filterMappings)
        {
            //Update Filter Mappings.
            if (filterMappings != null)
            {
                foreach (ac_user_report_filter_mapping mapping in filterMappings)
                {
                    if (mapping.filter_key != null || mapping.filter_key != "")
                    {
                        updateFilterMapping(userId, clientId, mapping.filter_key, mapping.filter_value);
                    }
                }
            }
        }

        internal void addRoles(int userId, int[]roleIds)
        {
            if (roleIds != null)
            {
                //Add role as specified
                using (DBModel db = new DBModel())
                {
                    foreach (int roleId in roleIds)
                    {
                        //If no role found for user - add role
                        ac_user_role_mapping roleMap = new ac_user_role_mapping();
                        roleMap.role_id = roleId;
                        roleMap.user_id = userId;
                        roleMap.updated_by = UserContextManager.getUserName();
                        roleMap.updated_on = DateTime.Now;
                        db.ac_user_role_mapping.Add(roleMap);
                        db.SaveChanges();
                    }
                }
            }
        }

        internal void addClientMappings(int userId, int[] clientIds)
        {
            if (clientIds != null)
            {
                //Add role as specified
                using (DBModel db = new DBModel())
                {
                    foreach (int clientId in clientIds)
                    {
                        //If no role found for user - add role
                        ac_client_user_mapping clientMap = new ac_client_user_mapping();
                        clientMap.client_id = clientId;
                        clientMap.user_id = userId;
                        clientMap.updated_by = UserContextManager.getUserName();
                        clientMap.updated_on = DateTime.Now;
                        db.ac_client_user_mapping.Add(clientMap);
                        db.SaveChanges();
                    }
                }
            }
        }

        internal void updateFilterMapping(int userId, int clientId, string filterKey, string filterVal) {
            using (DBModel db = new DBModel())
            {
                ac_user_report_filter_mapping mapping = db.ac_user_report_filter_mapping.Where(a => a.user_id == userId && a.client_id == clientId && a.filter_key.Equals(filterKey)).FirstOrDefault < ac_user_report_filter_mapping >();

                //If no role found for user - add role
                if (mapping == null)
                {
                    ac_user_report_filter_mapping fm = new ac_user_report_filter_mapping();
                    fm.user_id = userId;
                    fm.client_id = clientId;
                    fm.filter_key = filterKey;
                    fm.filter_value = filterVal;
                    fm.updated_by = UserContextManager.getUserName();
                    fm.updated_on = DateTime.Now;
                    db.ac_user_report_filter_mapping.Add(fm);
                    db.SaveChanges();
                }
                else {
                    if (!mapping.filter_value.Equals(filterVal)) { 
                        mapping.filter_key = filterKey;
                        mapping.filter_value = filterVal;
                        mapping.updated_by = UserContextManager.getUserName();
                        mapping.updated_on = DateTime.Now;
                        db.SaveChanges();
                    }
                }
            }
        }

        internal bool delUser(string userid)
        {
            try
            {
                int id = int.Parse(userid);
                using (DBModel db = new DBModel())
                {
                    var userMaster = db.ac_user_master.Where(a => a.user_id == id)
                        .FirstOrDefault<ac_user_master>();
                    Console.WriteLine(userMaster);
                    userMaster.is_deleted = Messages.YES;
                    userMaster.is_active = Messages.NO;
                    db.SaveChanges();

                }
                return true;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message); 
                return false;
            }
            
        }

       

        internal bool updateClient(int clientId, string methodType)
        {
            try
            {
                if (methodType.Equals("DEFAULT"))
                {
                    using (DBModel db = new DBModel())
                    {
                        int userId = Common.UserContextManager.getUserId();
                        var userMaster = db.ac_user_master.Where(a => a.user_id == userId)
                            .FirstOrDefault<ac_user_master>();
                        userMaster.client_id = clientId;
                        db.SaveChanges();

                        Common.UserContextManager.setDefaultClientId(clientId);
                    }
                    return true;
                }
                else /* Change client in current context */
                {
                    int userId = Common.UserContextManager.getUserId();
                    Common.UserContextManager.initUserContextMenu(clientId,userId);
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return false;
            }
            return true;
        }

        public ac_user_master getUserInfo(int userId)
        {
            try
            {
                using (DBModel db = new DBModel())
                {

                    var userMaster = db.ac_user_master.Where(a => a.user_id == userId && a.is_deleted == Messages.NO)
                       .FirstOrDefault<ac_user_master>();

                    return userMaster;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return null;
            }
        }


        internal bool forgetpasswordreset(ac_user_master user, string emailVerificationCode)
        {
            try
            {

                using (DBModel db = new DBModel())
                {
                    var userMaster = db.ac_user_master.Where(a => a.user_id == user.user_id && a.is_deleted == Messages.NO)
                       .FirstOrDefault<ac_user_master>();

                    userMaster.email_verification_code = emailVerificationCode;
                    db.SaveChanges();
                    /** Send Email for Verification */
                    Dictionary<string, string> emailContent = new Dictionary<string, string>();
                    // Send Verification Email
                    emailContent.Add("__VERIFICATION_CODE__", emailVerificationCode);
                    emailContent.Add("__USERNAME__", user.display_Name);
                    emailContent.Add("__BASE_PATH__", Util.GetBaseUrl(user.client_id.Value));
                    SendMail.Send(Messages.TEMPLATE_FORGET_PASSWORD, userMaster.email, emailContent);

                }
                return true;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return false;
            }
        }

        internal bool sendOtp(string userName,string userId, string otp)
        {
            try
            {
                AuthService oAuth = new AuthService();
                ac_user_master userMaster = oAuth.getUserInfo(userId);
                string userEmail = userMaster.email;
                
                Dictionary<string, string> emailContent = new Dictionary<string, string>();
                // Send Verification Email
                emailContent.Add("__OTP__", otp);
                emailContent.Add("__USERNAME__", userName);
                SendMail.Send(Messages.TEMPLATE_EMAIL_LOGIN_OTP, userEmail, emailContent);
                return true;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return false;
            }
        }

        internal LoginModel resetPassword(string verificationCode, ResetPassword oResetPassword)
        {
            try
            {
                LoginModel login = new LoginModel();
                using (DBModel db = new DBModel())
                {
                    var userMaster = db.ac_user_master.Where(a => a.email_verification_code == verificationCode)
                        .FirstOrDefault<ac_user_master>();
                    Console.WriteLine(userMaster);
                    userMaster.email_verification_code = "";
                    userMaster.password = Util.GetMD5Hash(oResetPassword.newPassword);
                    userMaster.is_first_time_login = Messages.NO;
                    userMaster.is_active = Messages.YES;
                    db.SaveChanges();
                   

                    login.password = oResetPassword.newPassword;
                    login.username = userMaster.login_id;
                }
                return login;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return null;
            }
        }

        internal bool addContact(ContactModel cm)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_contactus contact = new ac_contactus();
                    contact.user_id = cm.user_id;
                    contact.client_id = cm.client_id;
                    contact.report = cm.report;
                    contact.comments = cm.comments;
                    contact.subject = cm.subject;
                    contact.updated_by = UserContextManager.getUserName();
                    contact.requested_on = DateTime.Now;
                    contact.updated_on = DateTime.Now;

                    db.ac_contactus.Add(contact);
                    db.SaveChanges();

                    Dictionary<string, string> emailContent = new Dictionary<string, string>();
                    emailContent.Add("__USERNAME__", UserContextManager.getUserName());
                    emailContent.Add("__REPORT__", contact.report);
                    emailContent.Add("__SUBJECT__", contact.subject);
                    emailContent.Add("__COMMENTS__", contact.comments);

                    var userEmail = UserContextManager.getEmail();

                    //Send mailt o User.
                    SendMail.Send(Messages.TEMPLATE_EMAIL_CONTACTUS, userEmail, emailContent);

                    //Send Mail to Tech Support
                    SendMail.Send(Messages.TEMPLATE_CONTACTUS, Settings.EMAIL_TECH_SUPPORT, emailContent);
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                Console.WriteLine(msg);
                Console.Write(ex.StackTrace);
                return false;
            }
            return true;
        }

    }
}