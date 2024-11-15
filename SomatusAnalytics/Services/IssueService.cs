
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;

namespace SomatusAnalytics.Services
{
    public class IssueService
    {
        public bool saveRequest(int userId, IssueModel sm, int clientId)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_subscribe sub = new ac_subscribe();
                    sub.email_id = sm.email;
                    sub.frequency = sm.frequency;
                    
                    sub.client_id = clientId;
                    sub.user_id = userId;
                   
                    sub.subscribe_on = DateTime.Now;
                    db.ac_subscribe.Add(sub);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }

            return true;

        }

    }
}