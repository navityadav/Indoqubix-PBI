
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace SomatusAnalytics.Services
{
    public class ReportService
    {
        [OutputCache(Duration = 1800, VaryByParam = "clientId;reportURI")]
        public IQReportConfig getReportSetting(int clientId, String reportURI)
        {
            using (DBModel db = new DBModel())
            {
                var reportConfig = db.ac_powerbi_report.Where(a => a.client_id == clientId && a.uri.Equals(reportURI)).FirstOrDefault<ac_powerbi_report>();

                var clientBIConfig = db.ac_bi_access_app.Where(a => a.client_id == clientId).FirstOrDefault<ac_bi_access_app>();

                IQReportConfig oIQReportConfig = new IQReportConfig();
                oIQReportConfig.Username = clientBIConfig.app_user_name;
                oIQReportConfig.Password = clientBIConfig.app_password;
                oIQReportConfig.ApplicationSecret = clientBIConfig.application_secret;
                oIQReportConfig.ApplicationId = clientBIConfig.application_id;
                oIQReportConfig.ResourceUrl = clientBIConfig.resoruce_uri;
                oIQReportConfig.Tenant = clientBIConfig.tenant;
                oIQReportConfig.AuthorityUrl = clientBIConfig.authority_uri;
                oIQReportConfig.AuthorityType = clientBIConfig.authority_type;
                oIQReportConfig.ApiUrl = clientBIConfig.api_url;
                oIQReportConfig.AuthenticationType = clientBIConfig.authority_type;

                /** Report Settings */
                if(reportConfig != null) { 
                    oIQReportConfig.ReportId = Util.GetParamGuid(reportConfig.report_id);
                    oIQReportConfig.WorkspaceId = Util.GetParamGuid( reportConfig.workspace_id);
                    oIQReportConfig.reportTitle = reportConfig.title;
                    oIQReportConfig.reportSubTitle = reportConfig.subtitle;
                    oIQReportConfig.ShowFilter = reportConfig.show_filter;
                    oIQReportConfig.ShowTab = reportConfig.show_tab;
                }
                else
                {
                    throw new NotImplementedException();
                }

                return oIQReportConfig;
            }
        }


        [OutputCache(Duration = 1800, VaryByParam = "clientId ")]
        public void getClientIntegrationSetting(int clientId)
        {
            using (DBModel db = new DBModel())
            {
                var clientConfig = db.ac_client_master.Where(a => a.client_id == clientId).FirstOrDefault<ac_client_master>();


            }
        }
    }
}