using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Common
{
    public static class Logger
    {
        private static readonly ILogger _logger;
        /*
         *   .WriteTo.AzureAnalytics(workspaceId: "",
                                 authenticationId: "")
                 .WriteTo.File(HttpContext.Current.Server.MapPath(""), rollingInterval: RollingInterval.Hour)
         */
        static Logger()
        {
           _logger = new LoggerConfiguration()
                .ReadFrom.AppSettings().CreateLogger();
        }

        public static void LogError(string log)
        {
            _logger.Error(log);
        }

        public static void LogInfo(string log)
        {
            _logger.Information(log);
        }

        public static void LogDebug(string log)
        {
            _logger.Debug(log);
        }
    }
}