using Newtonsoft.Json;
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SomatusAnalytics.Services
{
    public class ReportBuilderService
    {
        
        [OutputCache(Duration = 1800, VaryByParam = "clientId ")]
        public ReportBuilderConfig getReportBuilderTables(int clientId)
        {
            using (DBModel db = new DBModel())
            {
                var tableList = db.ac_report_builder_source_table.Where(a => a.client_id == clientId).OrderBy(a => a.table_name).ToList<ac_report_builder_source_table>();
                ReportBuilderConfig oDataTableConfig = new ReportBuilderConfig();

                List<ReportBuilderTable> tables = new List<ReportBuilderTable>();
                foreach (var tableInfo in tableList) // Loop through List with foreach
                {
                    ReportBuilderTable oReportBuilderTable = new ReportBuilderTable();
                    oReportBuilderTable.table_name = tableInfo.table_name;
                    oReportBuilderTable.display_name = tableInfo.display_name;
                    oReportBuilderTable.table_id = tableInfo.source_table_id;

                    tables.Add(oReportBuilderTable);

                }
                oDataTableConfig.tables = tables;
               // oDataTableConfig.tables = this.GetColumnNames(clientId, tables[0]);

                return oDataTableConfig;
            }
        }

        [OutputCache(Duration = 1800, VaryByParam = "clientId, table_id ")]
        public ac_report_builder_source_table getReportBuilderTableConfig(int clientId, int table_id)
        {
            using (DBModel db = new DBModel())
            {
                var tableConfig = db.ac_report_builder_source_table.Where(a => a.client_id == clientId && a.source_table_id == table_id).FirstOrDefault<ac_report_builder_source_table>();
                return tableConfig;
            }
        }



        public List<ReportBuilderSavedReport> getReportBuilderSavedReports(int clientId, int userId,string role)
        {
            using (DBModel db = new DBModel())
            {
                // Check if User has report based on client Id and User Id
                var reportList = db.ac_report_builder_userdefined
                    .Where(a => (a.client_id == clientId && a.user_id == userId) || (a.client_id == clientId && a.roles.Contains(role)))
                    .OrderBy(a => a.display_seq).OrderBy(a =>  a.report_name).ToList<ac_report_builder_userdefined>();


                ReportBuilderConfig oDataTableConfig = new ReportBuilderConfig();

                List<ReportBuilderSavedReport> reports = new List<ReportBuilderSavedReport>();
                foreach (var report in reportList) // Loop through List with foreach
                {

                    ReportBuilderSavedReport oReportBuilderSavedReport = new ReportBuilderSavedReport();
                    oReportBuilderSavedReport.report_name = report.report_name;
                    oReportBuilderSavedReport.report_id = report.datatable_report_id;
                    oReportBuilderSavedReport.report_creator_id = report.user_id;
                    reports.Add(oReportBuilderSavedReport);
                }
                return reports;
            }
        }

        public ac_report_builder_userdefined getReport(int clientId,int userId, int reportId,string role=null)
        {
            using (DBModel db = new DBModel())
            {

                var report = db.ac_report_builder_userdefined
                    .Where(a => ((a.client_id == clientId && a.user_id == userId)||(a.client_id == clientId && a.roles.Contains(role))) && a.datatable_report_id == reportId).FirstOrDefault< ac_report_builder_userdefined>();
                
                return report;
            }
        }

        public List<string> GetColumnNames(int clientId,  int tableId)
        {
            DirectDatabaseAccessService oDirectDatabaseAccessService = new DirectDatabaseAccessService();
            /** Get Table Info */
            var ac_report_builder_source_table= this.getReportBuilderTableConfig(clientId, tableId);
            oDirectDatabaseAccessService.intClientDBConnectionByID(ac_report_builder_source_table.db_setting_id);
            
            string tableQuery = this.getTableDefQuery(clientId, tableId);
            
            return oDirectDatabaseAccessService.GetColumnNames(tableQuery);
        }

        public Dictionary<string, string> GetColumnDef(int clientId, int tableId)
        {
            DirectDatabaseAccessService oDirectDatabaseAccessService = new DirectDatabaseAccessService();
            /** Get Table Info */
            var ac_report_builder_source_table = this.getReportBuilderTableConfig(clientId, tableId);
            oDirectDatabaseAccessService.intClientDBConnectionByID(ac_report_builder_source_table.db_setting_id);

            string tableQuery = this.getTableDefQuery(clientId, tableId);

            return oDirectDatabaseAccessService.GetColumnDef(tableQuery);
        }

        public DataTable GetUniqueListValue(int clientId, int table_id, ReportBuilderTableModel oReportBuilderTableModel)
        {
            DirectDatabaseAccessService oDirectDatabaseAccessService = new DirectDatabaseAccessService();
            var ac_report_builder_source_table = this.getReportBuilderTableConfig(clientId, table_id);
            oDirectDatabaseAccessService.intClientDBConnectionByID(ac_report_builder_source_table.db_setting_id);

            /** Get Global Table Condition */
            var tableConfig = this.getReportBuilderTableConfig(clientId, table_id);
            oReportBuilderTableModel.global_condition = tableConfig.condition;

            /** Get Query based on Report builder model */
            string query = this.getQuery(clientId, table_id, tableConfig.table_name, oReportBuilderTableModel, false, false);

            /** Return Datatable */
            return oDirectDatabaseAccessService.GetData(query);

        }

        public ReportDownloadRequest GetReportDownloadRequestObject(int userid, int clientId, int table_id, ReportBuilderTableModel oReportBuilderTableModel, String fileName, string email)
        {
            

            DirectDatabaseAccessService oDirectDatabaseAccessService = new DirectDatabaseAccessService();

            var ac_report_builder_source_table = this.getReportBuilderTableConfig(clientId, table_id);
            oDirectDatabaseAccessService.intClientDBConnectionByID(ac_report_builder_source_table.db_setting_id);

            SelfServiceReportDownloadRequest oReportDownloadRequest = new SelfServiceReportDownloadRequest();
            oReportDownloadRequest.fileName = fileName;
            oReportDownloadRequest.connectionStr =  oDirectDatabaseAccessService.connectionStr;

            oReportDownloadRequest.email = email;

            /** Get Global Table Condition */
            var tableConfig = this.getReportBuilderTableConfig(clientId, table_id);
            oReportBuilderTableModel.global_condition = tableConfig.condition;

            /** Get Query based on Report builder model */
            oReportDownloadRequest.query = this.getQuery(clientId, table_id, tableConfig.table_name, oReportBuilderTableModel, false, true);

            /** Return Datatable */
            return oReportDownloadRequest;

        }


        public DataTable GetData(int clientId,int table_id, ReportBuilderTableModel oReportBuilderTableModel, Boolean isPreview, Boolean isExport)
        {
         
            DirectDatabaseAccessService oDirectDatabaseAccessService = new DirectDatabaseAccessService();

            var ac_report_builder_source_table = this.getReportBuilderTableConfig(clientId, table_id);
            oDirectDatabaseAccessService.intClientDBConnectionByID(ac_report_builder_source_table.db_setting_id);

           
            /** Get Global Table Condition */
            var tableConfig = this.getReportBuilderTableConfig(clientId, table_id);
            oReportBuilderTableModel.global_condition = tableConfig.condition;

            /** Get Query based on Report builder model */
            string query = this.getQuery(clientId,table_id, tableConfig.table_name,oReportBuilderTableModel, isPreview, isExport);

            /** Return Datatable */
            return oDirectDatabaseAccessService.GetData(query);
            
        }



        [OutputCache(Duration = 1800, VaryByParam = "clientId;table_id")]
        public string getTableDefQuery(int clientId, int table_id)
        {
            using (DBModel db = new DBModel())
            {
                var tableInfo = db.ac_report_builder_source_table.Where(a => a.client_id == clientId && a.source_table_id==table_id).FirstOrDefault<ac_report_builder_source_table>();
                string query = "select " + tableInfo.fields + " from " + tableInfo.table_name + " where 1=0";// No data wanted, only schema  
                return query;
            }
        }

        public int deleteReport(int clientId, int userId, List<int> reportIds)
        {
           
            try
            {
                using (DBModel db = new DBModel())
                {
                   
                    foreach (int reportId in reportIds)
                    {
                      
                        var  report = db.ac_report_builder_userdefined.Where(a => a.client_id == clientId && a.datatable_report_id == reportId && a.user_id == userId).FirstOrDefault<ac_report_builder_userdefined>();
                        db.ac_report_builder_userdefined.Remove(report);
                        db.SaveChanges();
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }
        }

        public int saveReport(int clientId, int userId, string username,ReportBuilderTableModel oReportBuilderTableModel )
        {
            ac_report_builder_userdefined report = null;
            try
            {
                using (DBModel db = new DBModel())
                {
                    if (oReportBuilderTableModel.is_update == 1)
                    {
                        report = db.ac_report_builder_userdefined.Where(a => a.client_id == clientId && a.datatable_report_id == oReportBuilderTableModel.report_id).FirstOrDefault<ac_report_builder_userdefined>();
                    }
                    else
                    {
                        report = new ac_report_builder_userdefined();
                        
                    }

                    var table = this.getReportBuilderTableConfig(clientId, oReportBuilderTableModel.table_id);

                    report.client_id = clientId;
                    report.user_id = userId;
                    report.report_name = oReportBuilderTableModel.report_name;
                    report.source_table_id = oReportBuilderTableModel.table_id;
                    report.table_name = table.table_name;
                    string query = this.getQuery(clientId, oReportBuilderTableModel.table_id, table.table_name,oReportBuilderTableModel, false, false);
                    report.query = query;
                    report.dataselection_json =  JsonConvert.SerializeObject(oReportBuilderTableModel);
                    if (username == null)
                        username = "";
                    report.updated_by = username;
                    report.updated_on = DateTime.Now;

                    /** Add New Report */
                    if (oReportBuilderTableModel.is_update != 1)
                    {
                        db.ac_report_builder_userdefined.Add(report);
                    }

                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

            return report.datatable_report_id;

        }

        public string getQuery(int clientId,int table_id, string table_name, ReportBuilderTableModel oReportBuilderTableModel, Boolean isPreview, Boolean isExport)
        {

           Dictionary<string, string> columnDef = this.GetColumnDef(clientId, table_id);

            string columns=null;
            if (oReportBuilderTableModel.listColumn !=null && oReportBuilderTableModel.listColumn != "")
            {
                columns = oReportBuilderTableModel.listColumn + " as " + oReportBuilderTableModel.listColumn;
            }
            else
            {
                foreach (ReportBuilderTableColumn col in oReportBuilderTableModel.columns)
                {
                    var column = col.column;
                    string columnType="";
                    columnDef.TryGetValue(column, out columnType);
                    if (columnType == null)
                    {
                        column = "'NOT AVAILABLE' as " + column;
                    }
                    else if (columnType.Equals("NOT_SUPPORTED")) 
                    {
                        column = "'NOT SUPPORTED' as " + column;
                    }
                     

                    else if (columnType != null && columnType.Equals("DATE"))
                    {
                        // column = "FORMAT(["+column+"], 'yyyy-mm-dd') ";
                        //column = " convert(varchar,"+ column+", 23) ";
                        /** Cast is required to make column type as date in excel*/
                        if (!isExport)
                            column = " convert(varchar," + column + ", 23) ";
                        else
                            column = " CAST(" + column + " as date) ";

                        if (col.display_name == null || col.display_name == "" || col.column.Equals(col.display_name))
                        {
                            column += " as '" + col.display_name + "'";
                        }
                    }
                    else if (columnType != null && columnType.Equals("DATETIME"))
                    {
                        if (!isExport)
                            column = " convert(varchar," + column + ", 120) ";
                        else
                            column = " " + column + " ";
                        if (col.display_name == null || col.display_name == "" || col.column.Equals(col.display_name))
                        {
                            column += " as '" + col.display_name + "'";
                        }
                    }


                    if (columns != null)
                    {
                        columns += ", " + column;
                    }
                    else { 
                        columns = column;
                    }


                    if (col.display_name!=null && col.display_name!="" && !col.column.Equals(col.display_name))
                    {
                        columns += " as '" + col.display_name+"'";
                    }
                }

            }

            /** Add condition  */
            string condition = " Where ";

            /** Global Consition */
            if (oReportBuilderTableModel.global_condition!=null && !oReportBuilderTableModel.global_condition.Equals(""))
            {
                condition += " (" + oReportBuilderTableModel.global_condition + ") ";
            }
            else
            {
                condition += " (1=1) ";
            }

            /** user Condition */
            if (oReportBuilderTableModel.condition != null)
            {
                var tempCondition = "";
                foreach (ReportBuilderCondition cond in oReportBuilderTableModel.condition)
                {
                    if (oReportBuilderTableModel.listColumn != null && oReportBuilderTableModel.listColumn != "" && oReportBuilderTableModel.listColumn.Equals(cond.column))
                    {
                       continue;
                    }
                        var fieldCondition = this.getCondition(cond);
                    if (fieldCondition != null && fieldCondition.Length < 3)
                        continue;

                    if (tempCondition.Length > 4)
                    {
                        tempCondition += " and ";

                    }
                    tempCondition += fieldCondition;
                }
                if (tempCondition.Length > 4) { 
                    condition += " and ("+ tempCondition+ ")";
                    
                }
            }
            

            string query = "SELECT DISTINCT";
            if (isPreview)
                query += "  TOP 100 ";
            else
                query += " ";
            query  += columns+" from "+ table_name + condition;

            if (oReportBuilderTableModel.listColumn != null && oReportBuilderTableModel.listColumn != "")
            {
                query += "order by " + oReportBuilderTableModel.listColumn;
            }

                return query;
            

        }

        /** Send Report Email Request */

        public async Task<Boolean> sendReportExportRequest(int userId, int clientId, int reportId, string email, string reportName, Boolean isDirectDownloadRequest)
        {
            var report = getReport(clientId, userId, reportId);
            var fileName = reportName + ".xslx";
            ReportBuilderTableModel oReportBuilderTableModel = JsonConvert.DeserializeObject<ReportBuilderTableModel>(report.dataselection_json);

            using (var client = new HttpClient())
            {
                client.Timeout = TimeSpan.FromMinutes(10);
                ReportDownloadRequest oReportDownloadRequest = GetReportDownloadRequestObject(userId, clientId, report.source_table_id, oReportBuilderTableModel, reportName, email);

                /** Save DOwnload Request */
                ReportExportService oReportExportService = new ReportExportService();
                oReportDownloadRequest.exportId = oReportExportService.saveReportBuilderExportRequest(userId, clientId, reportId.ToString(), reportName, email, Messages.REPORT_TYPE_SELF_SERVICE);
                oReportDownloadRequest.userId = userId;
                oReportDownloadRequest.clientId = clientId;
                oReportDownloadRequest.envURL = Settings.ENV_URL;


                string json = JsonConvert.SerializeObject(oReportDownloadRequest);
                var requestData = new StringContent(json, Encoding.UTF8, "application/json");

                // var response = await client.PostAsync(String.Format(url), requestData);

                /** Sent Request to Download function */
                client.PostAsync(String.Format(Common.Settings.FUNC_SELF_SERVICE_REPORT_EXPORT_URL), requestData);

                /** Wait for sometime to make sure that request is sent */
                await Task.Delay(1500);

            }
            return true;
        }

            private string getCondition(ReportBuilderCondition cond)
        {
            if (cond.condition_value == null)
                return "";
            string value = cond.condition_value.Replace("'", "");
            /* <option value='eq'>=</option>
                         <option value='lt'>&LT;</option>
                         <option value='lte'>&LT;=</option>
                         <option value='gt'>&GT;</option>
                         <option value='gte'>&GT;=</option>
                         <option value='not_eq'>!=</option>
                         <option value='in'>in</option>
                         <option value='not in'>Not in</option>
                         <option value='contains'>Contains</option>*/

            if (cond.condition_operator.Equals("EQUAL"))
                return cond.column + " = '" + value + "'";
            else if (cond.condition_operator.Equals("LESS THAN"))
                return cond.column + " < '" + value + "'";
            else if (cond.condition_operator.Equals("LESS THAN or EQUAL"))
                return cond.column + " <= '" + value + "'";
            else if (cond.condition_operator.Equals("GREATER THAN"))
                return cond.column + " > '" + value + "'";
            else if (cond.condition_operator.Equals("GREATER THAN or EQUAL"))
                return cond.column + " >= '" + value + "'";
            else if (cond.condition_operator.Equals("NOT EQUAL"))
                return cond.column + " != '" + value + "'";
            else if (cond.condition_operator.Equals("IN")) {
                if (value.Contains(";")) {
                    value = value.Replace(";", "','");
                }
                else
                {
                    value = value.Replace(",", "','");
                }
                return cond.column + " in ('" + value + "')";
            }
            else if (cond.condition_operator.Equals("NOT IN")) {
                if (value.Contains(";"))
                {
                    value = value.Replace(";", "','");
                }
                else
                {
                    value = value.Replace(",", "','");
                }
                return cond.column + " not in ('" + value + "')";
            }
            else if (cond.condition_operator.Equals("CONTAINS"))
                return cond.column + " like '%" + value + "%'";


            return "";
        }
    }
}
