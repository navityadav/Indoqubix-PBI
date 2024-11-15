
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SomatusAnalytics.Services
{
    public class ReportExportService
    {
        private static Guid GetParamGuid(string param)
        {
            Guid paramGuid = Guid.Empty;
            Guid.TryParse(param, out paramGuid);
            return paramGuid;
        }


        public int saveReportBuilderExportRequest(int userId,int clientId, string referenceId, string fileName, string email, string type)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    ac_report_export_history re = new ac_report_export_history();
                    re.user_id = userId;
                    re.status = Messages.STATUS_NOT_STARTED;
                    var date = DateTime.Now;

                    re.schedule_start_datetime = date;
                    re.available_upto_date = date.AddDays(15);
                    re.client_id = clientId;
                    re.message = "Report : " + fileName;
                    re.email_id = email;
                    re.subject = "Report : " + fileName;
                    re.schedule_id = 0;
                    re.progress = 0;
                    re.reference_id = referenceId;
                    re.report_name = fileName;
                    re.instance = Settings.INSTANCE; //Added Instance
                    re.type = type;
                    db.ac_report_export_history.Add(re);
                    db.SaveChanges();
                    return re.report_export_id;
                }
            }
            catch (Exception ex)
            {
                var msg = ex.StackTrace;

            }
            return 0;
        }
        public void markasread(int userId)
        {
            using (DBModel db = new DBModel())
            {
                var exportList = db.ac_report_export_history.Where(a => a.user_id == userId && a.read_status == 0).ToList<ac_report_export_history>();
                foreach (ac_report_export_history export in exportList)
                {
                    export.read_status = 1;
                    db.SaveChanges();
                }
            }
        }

        public List<ac_report_export_history> getLatestReportExportRequest(int userId)
        {
            using (DBModel db = new DBModel())
            {
               
                var exportList = db.ac_report_export_history.Where(a => a.user_id == userId).OrderByDescending(a => a.schedule_start_datetime).Take(15).ToList<ac_report_export_history>();
                return exportList;
            }
        }

        public List<ac_report_export_history> getLatestReportExportRequest()
        {
            using (        DBModel db = new DBModel())
            {
                DateTime currentTime = DateTime.Now;
                DateTime x30MinsBeforer = currentTime.AddMinutes(-30);

                var exportList = db.ac_report_export_history
                    .Where(a => a.status == Messages.STATUS_IN_PROGRESS 
                            && a.type == Messages.REPORT_TYPE_POWERBI
                            && a.instance == Settings.INSTANCE
                            && a.schedule_start_datetime == x30MinsBeforer
                    ).OrderByDescending(a => a.schedule_start_datetime).Take(1).ToList<ac_report_export_history>();
                
                if (exportList != null && exportList.Count>0)
                    return null;

                exportList = db.ac_report_export_history.Where(a => a.status == Messages.STATUS_NOT_STARTED && a.type== Messages.REPORT_TYPE_POWERBI && a.instance == Settings.INSTANCE).OrderByDescending(a => a.schedule_start_datetime).Take(1).ToList<ac_report_export_history>();
                return exportList;
            }
        }

        public ac_report_export_history getReportBuilderExportRequest(int userId, int exportId)
        {
            using (DBModel db = new DBModel())
            {
                var export = db.ac_report_export_history.Where(a => a.user_id == userId && a.report_export_id == exportId).FirstOrDefault<ac_report_export_history>();
                return export;
            }
        }
    }
}