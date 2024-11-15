using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SomatusAnalytics.Services
{
    public class EmbedReportExportService
    {
        private PowerBIClient oPowerBIClient;
        private string token;

        public EmbedConfig EmbedConfig
        {
            get { return m_embedConfig; }
        }

      

        private EmbedConfig m_embedConfig;
     
        private TokenCredentials m_tokenCredentials;
        private IQReportConfig m_iqReportConfig;


        public EmbedReportExportService(IQReportConfig oIQReportConfig)
        {
            m_tokenCredentials = null;
            m_embedConfig = new EmbedConfig();
          
            m_iqReportConfig = oIQReportConfig;
            /* enable filter and tab configuration */
            m_embedConfig.showFilter = oIQReportConfig.ShowFilter;
            m_embedConfig.showTab = oIQReportConfig.ShowTab; 
            
        }

        public async Task<Boolean> sendPowerBIReportExportRequest(int userId, int clientId, string email, string reportName, string reportURI, int exportId,Boolean isDirectDownloadRequest)
        {
            /** Save Download Request */
            if (exportId == 0)
            {
                ReportExportService oReportExportService = new ReportExportService();
                exportId = oReportExportService.saveReportBuilderExportRequest(userId, clientId, reportURI, reportName, email, Messages.REPORT_TYPE_POWERBI);
            }

            /** Check if request is from web or scheduler */
            if(!isDirectDownloadRequest)
            {
                return true;
            }

            using (var client = new HttpClient())
            {
                //client.Timeout = TimeSpan.FromMinutes(10);

                ReportService oReportService = new ReportService();
                UserServices oUserService = new UserServices();
                var oUser = oUserService.getUserInfo(userId);
               
                var oIQReportConfig = oReportService.getReportSetting(clientId, reportURI);

              
                PowerBIReportDownloadRequest oReportDownloadRequest = await this.GetEmbedReportExportRequest();
                oReportDownloadRequest.email = email;
                oReportDownloadRequest.fileName = reportName;
                oReportDownloadRequest.instance = Settings.INSTANCE;
                oReportDownloadRequest.isAttachment = false;
                oReportDownloadRequest.userId = userId;
                oReportDownloadRequest.clientId = clientId;
                oReportDownloadRequest.envURL = Settings.ENV_URL;
                oReportDownloadRequest.userName = oUser.display_Name;
                oReportDownloadRequest.filters = this.getFilterCondition(userId,clientId);// "filter=Store/Territory eq 'NC' and Store/Chain eq 'Fashions Direct'";

                oReportDownloadRequest.exportId = exportId;

                string json = JsonConvert.SerializeObject(oReportDownloadRequest);
                var requestData = new StringContent(json, Encoding.UTF8, "application/json");

                /** Sent Request to Download function */
                await client.PostAsync(String.Format(Common.Settings.FUNC_POWERBI_REPORT_EXPORT_URL), requestData);

                /** Wait for sometime to make sure that request is sent */
                await Task.Delay(3000);
            }
            return true;
        }

        private string getFilterCondition(int userId, int clientId)
        {
            UserServices us = new UserServices();

            string filterCondition = "";
           
            var filters = us.getUserFilter(userId,clientId);
            foreach (SomatusAnalytics.Models.PowerBIReportFilter filter in filters)
            {
                if (filterCondition.Length > 5)
                    filterCondition += " and ";
                filterCondition += filter.table+"/"+filter.column+ " eq '"+filter.value+"'";
            }
            return filterCondition;
        }

        public async Task<PowerBIReportDownloadRequest> GetEmbedReportExportRequest()
        {
            PowerBIReportDownloadRequest oPowerBIReportDownloadRequest = new PowerBIReportDownloadRequest();
            var getCredentialsResult = await GetTokenCredentials();
            if (!getCredentialsResult)
            {
                // The error message set in GetTokenCredentials
                return null;
            }
            oPowerBIReportDownloadRequest.ReportId = m_iqReportConfig.ReportId.ToString();
            oPowerBIReportDownloadRequest.WorkspaceId = m_iqReportConfig.WorkspaceId.ToString();
            oPowerBIReportDownloadRequest.token = token;


            return oPowerBIReportDownloadRequest;
        }

        private async Task<string> PostExportRequest(PowerBIClient client, Guid reportId, Guid groupId, IList<string> pageNames = null /* Get the page names from the GetPages API */)
        {
            // For documentation purposes the export configuration is created in this method
            // Ordinarily, it would be created outside and passed in
            var powerBIReportExportConfiguration = new PowerBIReportExportConfiguration
            {
                Settings = new ExportReportSettings
                {
                    Locale = "en-us",
                }
            };
            var exportRequest = new ExportReportRequest
            {
                Format = FileFormat.PDF,
                PowerBIReportConfiguration = powerBIReportExportConfiguration,
            };


            var export = await oPowerBIClient.Reports.ExportToFileInGroupAsync(groupId, reportId, exportRequest);

            // Save the export ID, you'll need it for polling and getting the exported file
            return export.Id;
        }


        private async Task<Export> PollExportRequest(PowerBIClient client,
            Guid reportId, Guid groupId,string exportId /* Get from the ExportToAsync response */,
                int timeOutInMinutes)
        {
            Export exportStatus = null;
            DateTime startTime = DateTime.UtcNow;
            const int secToMillisec = 1000;
            do
            {
                if (DateTime.UtcNow.Subtract(startTime).TotalMinutes > timeOutInMinutes)
                {
                    // Error handling for timeout and cancellations
                    return null;
                }

                var httpMessage =
                    await client.Reports.GetExportToFileStatusInGroupWithHttpMessagesAsync(groupId, reportId, exportId);

                exportStatus = httpMessage.Body;
                if (exportStatus.Status == ExportState.Running || exportStatus.Status == ExportState.NotStarted)
                {
                    // The recommended waiting time between polling requests can be found in the RetryAfter header
                    // Note that this header is only populated when the status is either Running or NotStarted
                    var retryAfter = httpMessage.Response.Headers.RetryAfter;
                    var retryAfterInSec = retryAfter.Delta.Value.Seconds;

                    await Task.Delay(retryAfterInSec * secToMillisec);
                }
            }
            // While not in a terminal state, keep polling
            while (exportStatus.Status != ExportState.Succeeded && exportStatus.Status != ExportState.Failed);

            return exportStatus;
        }

        private async Task<ExportedFile> GetExportedFile(PowerBIClient client, Guid reportId,Guid groupId,Export export /* Get from the GetExportStatusAsync response */)
        {
            if (export.Status == ExportState.Succeeded)
            {
                var httpMessage =
                    await oPowerBIClient.Reports.GetFileOfExportToFileInGroupWithHttpMessagesAsync(groupId, reportId, export.Id);

                return new ExportedFile
                {
                    FileStream = httpMessage.Body,
                    ReportName = export.ReportName,
                    FileExtension = export.ResourceFileExtension,
                };
            }

            return null;
        }



        public async Task<ExportedFile> ExportPaginatedReport( Guid reportId, Guid groupId, int pollingtimeOutInMinutes)
        {
            try
            {
                // Get token credentials for user
                var getCredentialsResult = await GetTokenCredentials();
                if (!getCredentialsResult)
                {
                    // The error message set in GetTokenCredentials
                    return null;
                }

                oPowerBIClient = new PowerBIClient(new Uri(m_iqReportConfig.ApiUrl), m_tokenCredentials);
                // Create a Power BI Client object. It will be used to call Power BI APIs.
                //using (var client = new PowerBIClient(new Uri(m_iqReportConfig.ApiUrl), m_tokenCredentials))
               // {
                    var exportId = await PostExportRequest(oPowerBIClient, reportId, groupId);
                    var export = await PollExportRequest(oPowerBIClient, reportId, groupId, exportId, pollingtimeOutInMinutes);
                    if (export == null || export.Status != ExportState.Succeeded)
                    {
                        // Error, failure in exporting the report
                        return null;
                    }

                    return await GetExportedFile(oPowerBIClient, reportId, groupId, export);
               // }



            }
            catch(Exception ex)
            {
                // Error handling
                throw;
            }
             
        }


    /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        private string GetWebConfigErrors()
        {
            // Application Id must have a value.
            if (string.IsNullOrWhiteSpace(m_iqReportConfig.ApplicationId))
            {
                return "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }

            // Application Id must be a Guid object.
            Guid result;
            if (!Guid.TryParse(m_iqReportConfig.ApplicationId, out result))
            {
                return "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in web.config.";
            }

            // Workspace Id must have a value.
            if (m_iqReportConfig.WorkspaceId == Guid.Empty)
            {
                return "WorkspaceId is empty or not a valid Guid. Please fill its Id correctly in web.config";
            }


            if (m_iqReportConfig.AuthenticationType.Equals("MasterUser"))
            {
                // Username must have a value.
                if (string.IsNullOrWhiteSpace(m_iqReportConfig.Username))
                {
                    return "Username is empty. Please fill Power BI username in web.config";
                }

                // Password must have a value.
                if (string.IsNullOrWhiteSpace(m_iqReportConfig.Password))
                {
                    return "Password is empty. Please fill password of Power BI username in web.config";
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(m_iqReportConfig.ApplicationSecret))
                {
                    return "ApplicationSecret is empty. please register your application as Web app and fill appSecret in web.config.";
                }

                // Must fill tenant Id
                if (string.IsNullOrWhiteSpace(m_iqReportConfig.Tenant))
                {
                    return "Invalid Tenant. Please fill Tenant ID in Tenant under web.config";
                }
            }

            return null;
        }

        private async Task<AuthenticationResult> DoAuthentication()
        {
            AuthenticationResult authenticationResult = null;
            if (m_iqReportConfig.AuthenticationType.Equals("MasterUser"))
            {
                var authenticationContext = new AuthenticationContext(m_iqReportConfig.AuthorityUrl);

                // Authentication using master user credentials
                var credential = new UserPasswordCredential(m_iqReportConfig.Username, m_iqReportConfig.Password);
                authenticationResult = authenticationContext.AcquireTokenAsync(m_iqReportConfig.ResourceUrl, m_iqReportConfig.ApplicationId, credential).Result;
            }
            else
            {
                // For app only authentication, we need the specific tenant id in the authority url
                var tenantSpecificURL = m_iqReportConfig.AuthorityUrl.Replace("common", m_iqReportConfig.Tenant);
                var authenticationContext = new AuthenticationContext(tenantSpecificURL);

                // Authentication using app credentials
                var credential = new ClientCredential(m_iqReportConfig.ApplicationId, m_iqReportConfig.ApplicationSecret);
                authenticationResult = await authenticationContext.AcquireTokenAsync(m_iqReportConfig.ResourceUrl, credential);
            }

            return authenticationResult;
        }

        private async Task<bool> GetTokenCredentials()
        {
            // var result = new EmbedConfig { Username = username, Roles = roles };
            var error = GetWebConfigErrors();
            if (error != null)
            {
                m_embedConfig.ErrorMessage = error;
                return false;
            }

            // Authenticate using created credentials
            AuthenticationResult authenticationResult = null;
            try
            {
                authenticationResult = await DoAuthentication();
            }
            catch (AggregateException exc)
            {
                m_embedConfig.ErrorMessage = exc.InnerException.Message;
                return false;
            }

            if (authenticationResult == null)
            {
                m_embedConfig.ErrorMessage = "Authentication Failed.";
                return false;
            }
            token = authenticationResult.AccessToken;
            m_tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");
            return true;
        }

        public void setReportCofig(IQReportConfig oIQReportConfig)
        {
            throw new NotImplementedException();
        }

    }
}