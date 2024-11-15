using Quartz;
using SomatusAnalytics.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SomatusAnalytics.Scheduler
{
    public class PowerBIReportDownloadSchedule : IJob
    {
        private static Boolean RUNNING_STATUS = false;
        public Task Execute(IJobExecutionContext context)
        {
           
            if (!RUNNING_STATUS)
            {
                RUNNING_STATUS = true;

                executePendingPBIReports();

                /** Wait for sometime to make sure that request is sent */
                 Task.Delay(10000);

               
            }
            return Task.CompletedTask;
           
        }

        private void publishReport()
        {
            Dictionary<string, string> emailContent = new Dictionary<string, string>();

            // Send Verification Email
            emailContent.Add("__VERIFICATION_CODE__", "TEST");
            emailContent.Add("__USERNAME__", "");
           // SendMail.Send(Messages.TEMPLATE_EMAIL_VERIFICATION, oContext.email, emailContent);
        }

        private void executePendingPBIReports()
        {
            try
            {
                System.Console.WriteLine("Job Schedule");
                /** Get Pending Reports for Downloading */
                ReportExportService oReportExportService = new ReportExportService();

                var pendingPowerBIReports = oReportExportService.getLatestReportExportRequest();
                if (pendingPowerBIReports != null && pendingPowerBIReports.Count > 0)
                {
                    foreach (var reportRequest in pendingPowerBIReports) // Loop through List with foreach
                    {

                        ReportService oReportService = new ReportService();
                        var oIQReportConfig = oReportService.getReportSetting(reportRequest.client_id, reportRequest.reference_id);


                        EmbedReportExportService oEmbedReportExportService = new EmbedReportExportService(oIQReportConfig);

                        var result = oEmbedReportExportService.sendPowerBIReportExportRequest(reportRequest.user_id, reportRequest.client_id
                            , reportRequest.email_id, reportRequest.report_name, reportRequest.reference_id, reportRequest.report_export_id, true);
                    }
                }

            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
            }
            finally
            {
                RUNNING_STATUS = false;
                /** Send Report Based on the schedule */
            }
        }

    }
}