
using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;

namespace SomatusAnalytics.Services
{
    public class DirectDatabaseAccessService
    {
        public string connectionStr { get; set; }

        [OutputCache(Duration = 1800, VaryByParam = "clientId")]
        public void intClientDBConnectionByClient(int clientId)
        {
            using (DBModel db = new DBModel())
            {
                var ac_report_builder_db_setting = db.ac_report_builder_db_setting.Where(a => a.client_id == clientId).FirstOrDefault<ac_report_builder_db_setting>();
                if (ac_report_builder_db_setting.db_read_only == "0")
                {
                    connectionStr = "data source=" + ac_report_builder_db_setting.db_server + ";initial catalog=" + ac_report_builder_db_setting.db_name + ";Password=" + ac_report_builder_db_setting.db_password + ";persist security info=True;user id=" + ac_report_builder_db_setting.db_username + ";MultipleActiveResultSets=True;App=EntityFramework";
                }
                else {
                    connectionStr = "data source=" + ac_report_builder_db_setting.db_server + ";initial catalog=" + ac_report_builder_db_setting.db_name + ";Password=" + ac_report_builder_db_setting.db_password + ";persist security info=True;user id=" + ac_report_builder_db_setting.db_username + ";MultipleActiveResultSets=True;App=EntityFramework;ApplicationIntent=ReadOnly";

                }

               
            }
        }

        [OutputCache(Duration = 1800, VaryByParam = "dbSettingId")]
        public void intClientDBConnectionByID(int dbSettingId)
        {
            using (DBModel db = new DBModel())
            {
                var ac_report_builder_db_setting = db.ac_report_builder_db_setting.Where(a => a.db_setting_id == dbSettingId).FirstOrDefault<ac_report_builder_db_setting>();

                if (ac_report_builder_db_setting.db_read_only == "0")
                {
                    connectionStr = "data source=" + ac_report_builder_db_setting.db_server + ";initial catalog=" + ac_report_builder_db_setting.db_name + ";Password=" + ac_report_builder_db_setting.db_password + ";persist security info=True;user id=" + ac_report_builder_db_setting.db_username + ";MultipleActiveResultSets=True;App=EntityFramework";
                }
                else {
                    connectionStr = "data source=" + ac_report_builder_db_setting.db_server + ";initial catalog=" + ac_report_builder_db_setting.db_name + ";Password=" + ac_report_builder_db_setting.db_password + ";persist security info=True;user id=" + ac_report_builder_db_setting.db_username + ";MultipleActiveResultSets=True;App=EntityFramework;ApplicationIntent=ReadOnly";

                }
            }
        }



        public List<string> GetColumnNames(string tableQuery)
        {
            var result = new List<string>();
            using (var sqlCon = new SqlConnection(connectionStr))
            {
                sqlCon.Open();
                var sqlCmd = sqlCon.CreateCommand();
                sqlCmd.CommandText = tableQuery; 
                sqlCmd.CommandType = CommandType.Text;
                var sqlDR = sqlCmd.ExecuteReader();
                var dataTable = sqlDR.GetSchemaTable();
                foreach (DataRow row in dataTable.Rows) result.Add(row.Field<string>("ColumnName"));
                sqlCon.Close();
            }
            return result;
        }

        public Dictionary<string, string> GetColumnDef(string tableQuery)
        {
            var result = new Dictionary<string, string>();
            using (var sqlCon = new SqlConnection(connectionStr))
            {
                sqlCon.Open();
                var sqlCmd = sqlCon.CreateCommand();
                sqlCmd.CommandText = tableQuery;
                sqlCmd.CommandType = CommandType.Text;
                var sqlDR = sqlCmd.ExecuteReader();
                var dataTable = sqlDR.GetSchemaTable();
                foreach (DataRow row in dataTable.Rows) {
                    if (row.Field<object>("DataType") == typeof(DateTime) )
                    {
                        if((int)row.ItemArray[14] == 31)
                            result.Add(row.Field<string>("ColumnName"), "DATE");
                        else
                            result.Add(row.Field<string>("ColumnName"), "DATETIME");
                    }
                    else if (row.Field<object>("DataType") == typeof(string))
                    {
                        result.Add(row.Field<string>("ColumnName"), "STRING");
                    }
                    else if (row.Field<object>("DataType") == typeof(Byte[]))
                    {
                        result.Add(row.Field<string>("ColumnName"), "NOT_SUPPORTED");
                    }
                    else
                    {
                        result.Add(row.Field<string>("ColumnName"), "OTHER");
                    }

                    //result.Add(row.Field<string>("ColumnName"), row.Field<object>("DataType"));

                }
                sqlCon.Close();
            }
            return result;
        }

        public DataTable GetData(string query)
        {
           
            using (SqlConnection con = new SqlConnection(connectionStr))
            {
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.CommandTimeout = 60000;
                    cmd.CommandType = CommandType.Text;
                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        using (DataTable dt = new DataTable())
                        {
                            sda.Fill(dt);

                            return dt;
                        }
                    }
                }
            }
        }
    }
}
