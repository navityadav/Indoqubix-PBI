using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using SomatusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SomatusAnalytics.Services
{
    public class IQEmbedService : IEmbedService
    {

        public EmbedConfig EmbedConfig
        {
            get { return m_embedConfig; }
        }

        public TileEmbedConfig TileEmbedConfig
        {
            get { return m_tileEmbedConfig; }
        }

        private EmbedConfig m_embedConfig;
        private TileEmbedConfig m_tileEmbedConfig;
        private TokenCredentials m_tokenCredentials;
        private IQReportConfig m_iqReportConfig;
        public IQEmbedService(IQReportConfig oIQReportConfig)
        {
            m_tokenCredentials = null;
            m_embedConfig = new EmbedConfig();
            m_tileEmbedConfig = new TileEmbedConfig();
            m_iqReportConfig = oIQReportConfig;
            /* enable filter and tab configuration */
            m_embedConfig.showFilter = oIQReportConfig.ShowFilter;
            m_embedConfig.showTab = oIQReportConfig.ShowTab; 
            
        }

       
        public async Task<bool> EmbedReport(string username, string roles)
        {

            // Get token credentials for user
            var getCredentialsResult = await GetTokenCredentials();
            if (!getCredentialsResult)
            {
                // The error message set in GetTokenCredentials
                return false;
            }

            try
            {
                // Create a Power BI Client object. It will be used to call Power BI APIs.
                using (var client = new PowerBIClient(new Uri(m_iqReportConfig.ApiUrl), m_tokenCredentials))
                {
                    // Get a list of reports.
                    var reports = await client.Reports.GetReportsInGroupAsync(m_iqReportConfig.WorkspaceId);

                    // No reports retrieved for the given workspace.
                    if (reports.Value.Count() == 0)
                    {
                        m_embedConfig.ErrorMessage = "No reports were found in the workspace";
                        return false;
                    }

                    Report report;
                    if (m_iqReportConfig.ReportId == Guid.Empty)
                    {
                        // Get the first report in the workspace.
                        report = reports.Value.FirstOrDefault();
                    }
                    else
                    {
                        report = reports.Value.FirstOrDefault(r => r.Id == m_iqReportConfig.ReportId);
                    }

                    if (report == null)
                    {
                        m_embedConfig.ErrorMessage = "No report with the given ID was found in the workspace. Make sure ReportId is valid.";
                        return false;
                    }

                    var datasets = await client.Datasets.GetDatasetInGroupAsync(m_iqReportConfig.WorkspaceId, report.DatasetId);

                    m_embedConfig.IsEffectiveIdentityRequired = datasets.IsEffectiveIdentityRequired;
                    m_embedConfig.IsEffectiveIdentityRolesRequired = datasets.IsEffectiveIdentityRolesRequired;
                    GenerateTokenRequest generateTokenRequestParameters;
                    // This is how you create embed token with effective identities
                    if (!string.IsNullOrWhiteSpace(username))
                    {
                        var rls = new EffectiveIdentity(username, new List<string> { report.DatasetId });
                        if (!string.IsNullOrWhiteSpace(roles))
                        {
                            var rolesList = new List<string>();
                            rolesList.AddRange(roles.Split(','));
                            rls.Roles = rolesList;
                        }
                        // Generate Embed Token with effective identities.
                        generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view", identities: new List<EffectiveIdentity> { rls });
                    }
                    else
                    {
                        // Generate Embed Token for reports without effective identities.
                        generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                    }

                    var tokenResponse = await client.Reports.GenerateTokenInGroupAsync(m_iqReportConfig.WorkspaceId, report.Id, generateTokenRequestParameters);

                    if (tokenResponse == null)
                    {
                        m_embedConfig.ErrorMessage = "Failed to generate embed token.";
                        return false;
                    }

                    // Generate Embed Configuration.
                    m_embedConfig.EmbedToken = tokenResponse;
                    m_embedConfig.EmbedUrl = report.EmbedUrl;
                    m_embedConfig.Id = report.Id.ToString();
                }
            }
            catch (HttpOperationException exc)
            {
                m_embedConfig.ErrorMessage = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
                return false;
            }

            return true;
        }


        public async Task<bool> EmbedDashboard()
        {
            // Get token credentials for user
            var getCredentialsResult = await GetTokenCredentials();
            if (!getCredentialsResult)
            {
                // The error message set in GetTokenCredentials
                return false;
            }

            try
            {
                // Create a Power BI Client object. It will be used to call Power BI APIs.
                using (var client = new PowerBIClient(new Uri(m_iqReportConfig.ApiUrl), m_tokenCredentials))
                {
                    // Get a list of dashboards.
                    var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(m_iqReportConfig.WorkspaceId);

                    // Get the first report in the workspace.
                    var dashboard = dashboards.Value.FirstOrDefault();

                    if (dashboard == null)
                    {
                        m_embedConfig.ErrorMessage = "Workspace has no dashboards.";
                        return false;
                    }

                    // Generate Embed Token.
                    var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                    var tokenResponse = await client.Dashboards.GenerateTokenInGroupAsync(m_iqReportConfig.WorkspaceId, dashboard.Id, generateTokenRequestParameters);

                    if (tokenResponse == null)
                    {
                        m_embedConfig.ErrorMessage = "Failed to generate embed token.";
                        return false;
                    }

                    // Generate Embed Configuration.
                    m_embedConfig = new EmbedConfig()
                    {
                        EmbedToken = tokenResponse,
                        EmbedUrl = dashboard.EmbedUrl,
                        Id = dashboard.Id.ToString()
                    };

                    return true;
                }
            }
            catch (HttpOperationException exc)
            {
                m_embedConfig.ErrorMessage = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
                return false;
            }
        }

        public async Task<bool> EmbedTile()
        {
            // Get token credentials for user
            var getCredentialsResult = await GetTokenCredentials();
            if (!getCredentialsResult)
            {
                // The error message set in GetTokenCredentials
                m_tileEmbedConfig.ErrorMessage = m_embedConfig.ErrorMessage;
                return false;
            }

            try
            {
                // Create a Power BI Client object. It will be used to call Power BI APIs.
                using (var client = new PowerBIClient(new Uri(m_iqReportConfig.ApiUrl), m_tokenCredentials))
                {
                    // Get a list of dashboards.
                    var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(m_iqReportConfig.WorkspaceId);

                    // Get the first report in the workspace.
                    var dashboard = dashboards.Value.FirstOrDefault();

                    if (dashboard == null)
                    {
                        m_tileEmbedConfig.ErrorMessage = "Workspace has no dashboards.";
                        return false;
                    }

                    var tiles = await client.Dashboards.GetTilesInGroupAsync(m_iqReportConfig.WorkspaceId, dashboard.Id);

                    // Get the first tile in the workspace.
                    var tile = tiles.Value.FirstOrDefault();

                    // Generate Embed Token for a tile.
                    var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                    var tokenResponse = await client.Tiles.GenerateTokenInGroupAsync(m_iqReportConfig.WorkspaceId, dashboard.Id, tile.Id, generateTokenRequestParameters);

                    if (tokenResponse == null)
                    {
                        m_tileEmbedConfig.ErrorMessage = "Failed to generate embed token.";
                        return false;
                    }

                    // Generate Embed Configuration.
                    m_tileEmbedConfig = new TileEmbedConfig()
                    {
                        EmbedToken = tokenResponse,
                        EmbedUrl = tile.EmbedUrl,
                        Id = tile.Id.ToString(),
                        dashboardId = dashboard.Id.ToString()
                    };

                    return true;
                }
            }
            catch (HttpOperationException exc)
            {
                m_embedConfig.ErrorMessage = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
                return false;
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
                authenticationResult =  authenticationContext.AcquireTokenAsync(m_iqReportConfig.ResourceUrl, credential).Result;
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

            m_tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");
            return true;
        }

        public void setReportCofig(IQReportConfig oIQReportConfig)
        {
            throw new NotImplementedException();
        }

        private class ExportReportRequest
        {
            public string Format { get; set; }
        }
    }
}