
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Linq;

namespace SomatusAnalytics.Services
{
    public class SubscribeService
    {
        public static ac_subscribe getPendingSubscriptions ()
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var ac_subscribe = db.ac_subscribe.Where(a=> a.is_deleted == Messages.NO  && a.next_schedule_date < DateTime.Now && a.instance == Settings.INSTANCE)
                      .FirstOrDefault<ac_subscribe>();
                    return ac_subscribe;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return null;
            }
        }

        public static void updateSubscriptionForNextSchedule(int subscribe_id)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var ac_subscribe = db.ac_subscribe.Where(a => a.subscribe_id == subscribe_id)
                      .FirstOrDefault<ac_subscribe>();
                    var scheduleDateTime = Util.getNextDate(ac_subscribe.frequency, ac_subscribe.frequency_day);
                    ac_subscribe.next_schedule_date = scheduleDateTime;
                    ac_subscribe.last_sent_on = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
               
            }
        }

        public ac_subscribe getReportSubscriptionStatus(int userId, int clientId, string reportRefId, string reportType)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    var ac_subscribe = db.ac_subscribe.Where(a => a.user_id == userId && a.is_deleted == Messages.NO && a.report_type == reportType && a.report_ref_id == reportRefId)
                      .FirstOrDefault<ac_subscribe>();
                    return ac_subscribe;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return null;
            }
        }

        public bool saveRequest(int userId, SubscribeModel sm, int clientId)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    /** Update Subscription if already present */
                    var sub = db.ac_subscribe.Where(a => a.user_id == userId && a.is_deleted == Messages.NO && a.report_type == sm.reportType && a.report_ref_id == sm.reportId)
                      .FirstOrDefault<ac_subscribe>();

                    var NEW_SUBSCRIPTION = false;
                    if(sub == null) { 
                        sub = new ac_subscribe();
                        NEW_SUBSCRIPTION = true;
                    }
                    sub.email_id = Common.UserContextManager.getEmail();
                    sub.frequency = sm.frequency;
                    sub.report_type = sm.reportType;
                    sub.report_name = sm.reportName;
                    sub.report_ref_id = sm.reportId;
                    sub.type = sm.type.ToUpper();
                    sub.frequency_day = sm.frequencyDay;
                    sub.client_id = clientId;
                    sub.user_id = userId;
                    sub.subscribe_on = DateTime.Now;
                    sub.subscribe_by = Common.UserContextManager.getUserName();
                    sub.is_deleted = Messages.NO;
                    sub.instance = Settings.INSTANCE;

                    /** set Next Schedule Date */
                    var scheduleDateTime = Util.getNextDate(sm.frequency, sm.frequencyDay);
                    sub.next_schedule_date = scheduleDateTime;


                    if (NEW_SUBSCRIPTION)
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