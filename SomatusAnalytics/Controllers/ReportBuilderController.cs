using ClosedXML.Excel;
using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{
    
    public class ReportBuilderController : Controller
    {
        [Authorize]
        // GET: DataTable
        public ActionResult Index()
        {
            return View();
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult Configure()
        {
            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            int clientId = Common.UserContextManager.getClientId();
            return View(oReportBuilderService.getReportBuilderTables(clientId));
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult Edit()
        {
            int reportId = 0;
            int userId = Common.UserContextManager.getUserId();
            string role = Common.UserContextManager.getRole();
            ReportBuilderService oReportBuilderService = new ReportBuilderService();


            int clientId = Common.UserContextManager.getClientId();

            if (Request.Url.Segments.Length > 3)
            {
                var reportURI = Request.Url.Segments[3];
                reportId = Int32.Parse(reportURI);
            }
             ReportBuilderDisplayConfig oReportBuilderDisplayConfig = new ReportBuilderDisplayConfig();

            /** LoadSelected Report Detail */
            if (reportId != 0)
            {
                
                var report = oReportBuilderService.getReport(clientId, userId, reportId,role);
                ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);

                
                oReportBuilderDisplayConfig.selectedReport = oReportBuilderTableModel;
                oReportBuilderDisplayConfig.selectedReportId = reportId;
                oReportBuilderDisplayConfig.title = oReportBuilderTableModel.report_name;
            }
            else
            {
                oReportBuilderDisplayConfig.title = "Report Not Available";
            }
            return View("edit", oReportBuilderDisplayConfig);
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public int Delete(List<int> reportIds)
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            oReportBuilderService.deleteReport(clientId, userId, reportIds);

            return 1;
        }

        // GET: Subscribe
        //[HttpPost]
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult getTableColumn(ReportBuilderTableModel oDataTableModel)
        {
            int clientId = Common.UserContextManager.getClientId(); 

            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            var columnsList = oReportBuilderService.GetColumnDef(clientId, oDataTableModel.table_id);

            ReportBuilderConfig oReportBuilderConfig = new ReportBuilderConfig();
            oReportBuilderConfig.columns = columnsList;
            return View("ColumnSelection", oReportBuilderConfig);

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult List()
        {
            int clientId = Common.UserContextManager.getClientId();
           
            int userId = Common.UserContextManager.getUserId();
            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            ReportBuilderDisplayConfig oReportBuilderDisplayConfig = new ReportBuilderDisplayConfig();
            string role = Common.UserContextManager.getRole();

            /** Reports List */
            List<ReportBuilderSavedReport> oReports = oReportBuilderService.getReportBuilderSavedReports(clientId, userId,role);

            if(oReports==null || oReports.Count<=0)
            {
                oReportBuilderDisplayConfig.title = "Report Not Available";
            }else
                oReportBuilderDisplayConfig.reports = oReports;

            oReportBuilderDisplayConfig.selectedReportId = 0;
            oReportBuilderDisplayConfig.selectedReport = null;
            return View("list", oReportBuilderDisplayConfig);

        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult Display()
        {
            int clientId = Common.UserContextManager.getClientId();
            int reportId = 0;
            int userId = Common.UserContextManager.getUserId();
            string role = Common.UserContextManager.getRole();
            ReportBuilderService oReportBuilderService = new ReportBuilderService();

            /** Reports List */
            List<ReportBuilderSavedReport> oReports = oReportBuilderService.getReportBuilderSavedReports(clientId, userId,role);
            ReportBuilderDisplayConfig oReportBuilderDisplayConfig = new ReportBuilderDisplayConfig();

            if (Request.Url.Segments.Length>3)
            {
                var reportURI = Request.Url.Segments[3];
                reportId = Int32.Parse(reportURI);
            }
            else if (oReports!=null && oReports.Count > 0) { 
                reportId = oReports[0].report_id;
            }

            /** LoadSelected Report Detail */
            if (reportId != 0)
            {
                var report = oReportBuilderService.getReport(clientId, userId, reportId,role);
                ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);
                
                oReportBuilderDisplayConfig.reports = oReports;
                oReportBuilderDisplayConfig.selectedReport = oReportBuilderTableModel;
                oReportBuilderDisplayConfig.selectedReportId = reportId;
                oReportBuilderDisplayConfig.reportCreatorId = report.user_id;
                oReportBuilderDisplayConfig.title = oReportBuilderTableModel.report_name;
            }
            else
            {
                oReportBuilderDisplayConfig.title = "Report Not Available";
            }
            return View("display", oReportBuilderDisplayConfig);
        }

        /** Method to Load Data */
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public string LoadData()
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            string role = Common.UserContextManager.getRole();

            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            var reportURI = Request.Url.Segments[3];
            int reportId = Int32.Parse(reportURI);

            var report = oReportBuilderService.getReport(clientId, userId, reportId,role);
            ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);

            try
            {
                
                DataTable data = oReportBuilderService.GetData(clientId, report.source_table_id,oReportBuilderTableModel, false, false);

                string[] result = new string[data.Rows.Count];
                int i = 0;
                List<string[]> dataResult = new List<string[]>();
                foreach (DataRow row in data.Rows)
                {
                    var stringArr = data.Rows[i++].ItemArray.Select(x => x.ToString()).ToArray();
                    dataResult.Add(stringArr);

                }

                ReportBuilderData oReportBuilderData = new ReportBuilderData();
                oReportBuilderData.draw = 1;
                oReportBuilderData.recordsTotal = data.Rows.Count;
                oReportBuilderData.recordsFiltered = data.Rows.Count;
                oReportBuilderData.data = dataResult;

                return JsonConvert.SerializeObject(oReportBuilderData);
                //return JsonConvert.SerializeObject(dataResult);
                // return arrray.ToString();
            }catch(Exception ex)
            {
                Response.StatusCode = 400; // Replace .AddHeader
                var error = new ErrorConfig();  // Create class Error() w/ prop
                error.errorTitle = "Issue In Loading Data";
                error.ErrorMessage = ex.Message;
                error.helpMessage = oReportBuilderService.getQuery(clientId, report.source_table_id, oReportBuilderTableModel.table_name, oReportBuilderTableModel, false, false);
                return JsonConvert.SerializeObject(error);
            }

        }

        
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult ValueList(ReportBuilderTableModel oReportBuilderTableModel)
        {
            int clientId = Common.UserContextManager.getClientId();


            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            try
            {
                oReportBuilderTableModel.data = oReportBuilderService.GetUniqueListValue(clientId, oReportBuilderTableModel.table_id, oReportBuilderTableModel);

            }
            catch (Exception ex)
            {
                oReportBuilderTableModel.error = "Issue in Source Data Selection - " + ex.Message;
                oReportBuilderTableModel.query = "Query : " + oReportBuilderService.getQuery(clientId, oReportBuilderTableModel.table_id, oReportBuilderTableModel.table_name, oReportBuilderTableModel, false, false);
            }
            return View("ValueList", oReportBuilderTableModel);
        }

       
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult Preview(ReportBuilderTableModel oReportBuilderTableModel)
        {
            int clientId = Common.UserContextManager.getClientId();

           
            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            try
            {
                oReportBuilderTableModel.data = oReportBuilderService.GetData(clientId, oReportBuilderTableModel.table_id, oReportBuilderTableModel, true, false);
                
            }catch(Exception ex)
            {
                oReportBuilderTableModel.error = "Issue in Source Data Selection - " + ex.Message;
                oReportBuilderTableModel.query = "Query : " + oReportBuilderService.getQuery(clientId, oReportBuilderTableModel.table_id, oReportBuilderTableModel.table_name, oReportBuilderTableModel, false, false);
            }
            return View("preview", oReportBuilderTableModel);
        }

       
        [HttpPost]
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public int SaveReport(ReportBuilderTableModel oReportBuilderTableModel)
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            string username = Common.UserContextManager.getUserName();

            ReportBuilderService oReportBuilderService = new ReportBuilderService();

           return  oReportBuilderService.saveReport(clientId, userId, username, oReportBuilderTableModel);
           

        }
        /** Method to Export Data in Excel using Azure Functions */
        
        public const string StorageAccountName = "stopbidevbatch";
        public const string StorageAccountKey = "Iou2ptK2N4hvT+PUAO/rDjO7fMS9t1v1qp5oa6O45LK6auz2K2hhyT92j2oO+mpYF+zrEthGdCGEIJkQdApirw==";
        public const string StorageContainer = "selfservicereportoutput";

        /** Method to Export Data in Excel */
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public async Task emailDataExcel()
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            string role = Common.UserContextManager.getRole();

             UserServices oUserService = new UserServices();
            var oUser = oUserService.getUserInfo(userId);
           

            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            var reportURI = Request.Url.Segments[3];
            var urlElemnts = reportURI.Split('-');

            int reportId = Int32.Parse(urlElemnts[0]);
            var fileName = urlElemnts[1];

            var report = oReportBuilderService.getReport(clientId, userId, reportId,role);
            ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);

            using (var client = new HttpClient())
            {
                client.Timeout = TimeSpan.FromMinutes(10);
                ReportDownloadRequest oReportDownloadRequest = oReportBuilderService.GetReportDownloadRequestObject(userId, clientId, report.source_table_id, oReportBuilderTableModel, fileName, Common.UserContextManager.getEmail());
                
                /** Save DOwnload Request */
                ReportExportService oReportExportService = new ReportExportService();
                int exportId = oReportExportService.saveReportBuilderExportRequest(userId, clientId,reportId.ToString(), fileName, oReportDownloadRequest.email, Messages.REPORT_TYPE_SELF_SERVICE);
                oReportDownloadRequest.exportId = exportId;
                oReportDownloadRequest.userId = userId;
                oReportDownloadRequest.clientId = clientId;
                oReportDownloadRequest.envURL = Settings.ENV_URL;
                oReportDownloadRequest.userName = oUser.display_Name;


                string json = JsonConvert.SerializeObject(oReportDownloadRequest);
                var requestData = new StringContent(json, Encoding.UTF8, "application/json");
              
               // var response = await client.PostAsync(String.Format(url), requestData);
                
                /** Sent Request to Download function */
                client.PostAsync(String.Format(Common.Settings.FUNC_SELF_SERVICE_REPORT_EXPORT_URL), requestData);
                
                /** Wait for sometime to make sure that request is sent */
                await Task.Delay(1500);
                 
            }
                
        }
    
        /** Method to Export Data in Excel */
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public void exportDataExcel()
        {
            int clientId = Common.UserContextManager.getClientId();
            int userId = Common.UserContextManager.getUserId();
            string role = Common.UserContextManager.getRole();

            ReportBuilderService oReportBuilderService = new ReportBuilderService();
            var reportURI = Request.Url.Segments[3];
            var urlElemnts = reportURI.Split('-');

            int reportId = Int32.Parse(urlElemnts[0]);
            var fileName = urlElemnts[1];

            var report = oReportBuilderService.getReport(clientId, userId, reportId,role);
            ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);

            try
            {

                DataTable data = oReportBuilderService.GetData(clientId, report.source_table_id, oReportBuilderTableModel, false, true);

                /** set Sheet Name */
                data.TableName = fileName;

                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(data);

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename="+ fileName + ".xlsx");
                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                //return JsonConvert.SerializeObject(dataResult);
                // return arrray.ToString();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 400; // Replace .AddHeader
                var error = new ErrorConfig();  // Create class Error() w/ prop
                error.errorTitle = "Issue In Loading Data";
                error.ErrorMessage = ex.Message;
                error.helpMessage = oReportBuilderService.getQuery(clientId, report.source_table_id, oReportBuilderTableModel.table_name, oReportBuilderTableModel, false, true);
               
            }

        }

    }
}