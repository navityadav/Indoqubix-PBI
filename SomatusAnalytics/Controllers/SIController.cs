using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    public class SIController : Controller
    {
        //private readonly IEmbedService m_embedService;

        public SIController()
        {

            
        }
        // GET: SI
        public ActionResult Index()
        {
            return View();
        }

        
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public async Task emailReport(ExportRequestModel oExportRequestModel)
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            /** Get File for downloading */

            ReportService oReportService = new ReportService();
            var oIQReportConfig = oReportService.getReportSetting(clientId, oExportRequestModel.reportURI);

            EmbedReportExportService oEmbedReportExportService = new EmbedReportExportService(oIQReportConfig);

            await oEmbedReportExportService.sendPowerBIReportExportRequest(userId,clientId, UserContextManager.getEmail(), oExportRequestModel.reportName, oExportRequestModel.reportURI,0, Settings.FUNC_POWERBI_REPORT_DIRECT_DOWNLOAD);
        }


        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public async Task ExportToPDF(ExportRequestModel oExportRequestModel)
        {
            /** Get File for downloading */
            ExportedFile embedResult = null;
            try
            {
                ReportService oReportService = new ReportService();
                int clientId = Common.UserContextManager.getClientId();
                var oIQReportConfig = oReportService.getReportSetting(clientId, oExportRequestModel.reportURI);

                EmbedReportExportService m_EmbedReportExportService = new EmbedReportExportService(oIQReportConfig);
                embedResult = await  m_EmbedReportExportService.ExportPaginatedReport(oIQReportConfig.ReportId, oIQReportConfig.WorkspaceId, 2);

               // return embedResult;

                Response.Clear();
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + embedResult.ReportName + "." + embedResult.FileExtension);

                const int bufferLength = 10000;
                byte[] buffer = new Byte[bufferLength];
                int length = 0;
               

                Response.Buffer = true;
                do
                {
                    if (Response.IsClientConnected)
                    {
                        length = embedResult.FileStream.Read(buffer, 0, bufferLength);
                        Response.OutputStream.Write(buffer, 0, length);
                        buffer = new Byte[bufferLength];
                    }
                    else
                    {
                        length = -1;
                    }
                }
                while (length > 0);
                Response.Flush();
                Response.End();


               

            }
            catch (Exception ex)
            {
                Response.StatusCode = 400; // Replace .AddHeader
                var error = new ErrorConfig();  // Create class Error() w/ prop
                error.errorTitle = "Issue In Loading Data";
                error.ErrorMessage = ex.Message;
            }
            finally
            {
                if (embedResult.FileStream != null)
                    embedResult.FileStream.Close();
            }
            //

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public async Task<ActionResult> Report(string username, string roles)
        {

            if (Request.Url.Segments.Length < 4)
            {
                return View("DynamicErrorMessage", Common.Messages.Error404());
            }
            else { 

                var reportURI = Request.Url.Segments[3];
                /** Check if user is having permission to access URL */
                if (!UserContextManager.isMenuAccess(reportURI))
                {
                    return View("DynamicErrorMessage", Common.Messages.unAuthorizedAccess());
                }

                try
                {
                    var queryString = HttpUtility.UrlDecode(Request.QueryString.ToString());
                    List<PowerBIReportFilter> powerBIReportFilterList = new List<PowerBIReportFilter>();
                    if (!string.IsNullOrEmpty(queryString))
                    {
                        var queryArr = queryString.Split('&');
                        if (queryArr.Length > 0)
                        {
                            foreach(var filter in queryArr)
                            {
                                if (!filter.Contains(":") || !filter.Contains("="))
                                    continue;
                               
                                var filterKeyValueCol = filter.Split('=');
                                var value = filterKeyValueCol?[1];
                                var column = filterKeyValueCol?[0].Split(':')?[1];
                                var table = filterKeyValueCol?[0].Split(':')?[0];

                                PowerBIReportFilter powerBIReportFilter = new PowerBIReportFilter
                                {
                                    value=value,
                                    column = column,
                                    table=table
                                };
                                powerBIReportFilterList.Add(powerBIReportFilter);
                            }
                        }
                    }

                    ReportService oReportService = new ReportService();
                    int clientId = Common.UserContextManager.getClientId();
                    var oIQReportConfig = oReportService.getReportSetting(clientId, reportURI);

                    IQEmbedService m_embedService = new IQEmbedService(oIQReportConfig);
                    /** Add report URI for download*/
                    m_embedService.EmbedConfig.reportURI = reportURI;
                    m_embedService.EmbedConfig.reportTitle = oIQReportConfig.reportTitle;
                    m_embedService.EmbedConfig.PagerReportFilters = powerBIReportFilterList;
                    var embedResult = await m_embedService.EmbedReport(username, roles);
                    return View(m_embedService.EmbedConfig);
                    
                }
                catch (Exception ex)
                {
                    return View("DynamicErrorMessage", Common.Messages.ReportError(ex));
                }
            }
        }

       

        [Authorize]
        public async Task<ActionResult> EmbedDashboard()
        {
            /*var embedResult = await m_embedService.EmbedDashboard();
            if (embedResult)
            {
                return View(m_embedService.EmbedConfig);
            }
            else
            {
                return View(m_embedService.EmbedConfig);
            }*/
            return null;
        }

        [Authorize]
        public async Task<ActionResult> EmbedTile()
        {
            /*var embedResult = await m_embedService.EmbedTile();
            if (embedResult)
            {
                return View(m_embedService.TileEmbedConfig);
            }
            else
            {
                return View(m_embedService.TileEmbedConfig);
            }*/
            return null;
        }
    }
}