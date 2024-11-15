using Newtonsoft.Json;
using Quartz;
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SomatusAnalytics.Scheduler
{
    public class ReportSubscriberSchedule : IJob
    {
        private static Boolean RUNNING_STATUS = false;
        public Task Execute(IJobExecutionContext context)
        {
            if (!RUNNING_STATUS) { 
              
                RUNNING_STATUS = true;

                generateSubscribedReportSchedule();

                /** Wait for sometime to make sure that request is sent */
                Task.Delay(10000);

                RUNNING_STATUS = false;
                /** Send Report Based on the schedule */
            }
            return Task.CompletedTask;
        }


        private void generateSubscribedReportSchedule()
        {
            /** Send Report Based on the published */
            var ac_subscribe = SubscribeService.getPendingSubscriptions();
            if (ac_subscribe != null)
            {
                /** Get User Information for sending personalized Message */
                UserServices oUserServices = new UserServices();
                var user = oUserServices.getUserInfo(ac_subscribe.user_id);

                if (user != null) {
                    if(ac_subscribe.type.Equals( Messages.REPORT_PUBLISH_TYPE_LINK))
                        this.publishReportLink( ac_subscribe, user);
                    else if (ac_subscribe.type.Equals(Messages.REPORT_PUBLISH_TYPE_FILE))
                        this.publishGeneratedReports(ac_subscribe, user);

                    /** Update Next Schedule */
                    SubscribeService.updateSubscriptionForNextSchedule(ac_subscribe.subscribe_id);
                }
                else
                {
                    // Cancel shceudle
                }
            }
        }

        private void publishGeneratedReports(ac_subscribe subscribe, ac_user_master user)
        {
            

            if (subscribe.report_type.Equals(Messages.REPORT_TYPE_POWERBI))
            {
                ReportService oReportService = new ReportService();
                var oIQReportConfig = oReportService.getReportSetting(subscribe.client_id, subscribe.report_ref_id);

                EmbedReportExportService oEmbedReportExportService = new EmbedReportExportService(oIQReportConfig);

                oEmbedReportExportService.sendPowerBIReportExportRequest(subscribe.user_id, subscribe.client_id,
                    user.email, subscribe.report_name, subscribe.report_ref_id, 0, true);
            }else if (subscribe.report_type.Equals(Messages.REPORT_TYPE_SELF_SERVICE))
            {
                ReportBuilderService oReportBuilderService = new ReportBuilderService();
               
                oReportBuilderService.sendReportExportRequest(subscribe.user_id, subscribe.client_id, int.Parse(subscribe.report_ref_id),
                    user.email, subscribe.report_name, true);

            }

        }

        private void publishReportLink(ac_subscribe  subscribe, ac_user_master user )
        {
            var publisedURI = PublishService.publishURL(subscribe.user_id, subscribe.client_id, subscribe.report_ref_id, subscribe.report_type);
            if (publisedURI != null)
            {
                /** Send Email */
                // Send Verification Email
                Dictionary<string, string> emailContent = new Dictionary<string, string>();

                emailContent.Add("__REPORT_URI__", publisedURI);
                emailContent.Add("__USERNAME__", user.display_Name);
                emailContent.Add("__BASE_PATH__", Settings.ENV_URL);


                Dictionary<string, string> subjectContent = new Dictionary<string, string>();
                subjectContent.Add("__REPORT_NAME__", subscribe.report_name);

                /** Send Email **/
                SendMail.Send(Messages.TEMPLATE_PUBLISH_REPORT_LINK, user.email, emailContent, subjectContent);

               

            }
        }


    }

}