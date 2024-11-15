using SomatusAnalytics.Models;
using System;


namespace SomatusAnalytics.Common
{
    public static class Messages
    {
        public const string E_404 = "404 Error";
        public const string E_401 = "Error : Unauthorized Access";

        public const string RESOURCE_NOT_AVAILABLE = "Request resource is not avaliable!";
        public const string PROBLEM_PERSIST_SOLUTION = "Please try again. If this error persist then please contact System Administrator";

        public const string RESOURCE_UNAUTHORIZED_ACCESS = "Unauthorized access";
        public const string RESOURCE_UNAUTHORIZED_ACCESS_SUB_TEXT = "Please try logging out and logging back in to view this report. If the error still persists, please contact techsupport@somatus.com.";


        public const string E_REPORT_404 = "Invalid Report";
        public const string REPORT_NOT_AVAILABLE = "Request report is not avaliable!";

        public const string E_500 = "Unexpected Error";
        public const string UNEXPECTED_ERROR = "An Unexpected Error occured while processing request";

        public const string STATUS_NOT_STARTED = "N";
        public const string STATUS_IN_PROGRESS = "I";
        public const string STATUS_COMPLETED   = "C";
        public const string STATUS_ERROR       = "E";

        public const string YES = "Y";
        public const string NO = "N";

        public const string REPORT_PUBLISH_TYPE_LINK = "LINK";
        public const string REPORT_PUBLISH_TYPE_FILE = "FILE";

        public const string REPORT_TYPE_SELF_SERVICE = "SELF_SERVICE";
        public const string REPORT_TYPE_POWERBI= "PBI";
        public const string REPORT_DOWNLOAD = "DOWNLOAD";
        public const string REPORT_PDF = "PDF";

        public const string USER_TYPE_AD = "AD";
        public const string USER_TYPE_LOCAL = "LOCAL";

        public const string TEMPLATE_EMAIL_VERIFICATION = "EMAIL_VERIFICATION";
        public const string TEMPLATE_FORGET_PASSWORD = "FORGET_PASSWORD";
        public const string TEMPLATE_ACCOUNT_ACTIVATED = "ACCOUNT_ACTIVATED";
        public const string TEMPLATE_PUBLISH_REPORT_LINK = "PUBLISH_REPORT_LINK";
        public const string TEMPLATE_SUBSCRIBE_REPORT_REQUEST = "SUBSCRIBE_REPORT_REQUEST";
        public const string TEMPLATE_EMAIL_WELCOME = "EMAIL_WELCOME";
        public const string TEMPLATE_EMAIL_UPDATE_USER = "EMAIL_UPDATE_USER";

        public const string TEMPLATE_EMAIL_LOGIN_OTP = "EMAIL_LOGIN_OTP";
        public const string TEMPLATE_CONTACTUS = "CONTACTUS";
        public const string TEMPLATE_EMAIL_CONTACTUS = "EMAIL_CONTACT_USER";
        public const string EMAIL_TECHSUPPORT = "techsupport@somatus.com";
        

        public static ErrorConfig ReportError(Exception ex)
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = Common.Messages.REPORT_NOT_AVAILABLE;
            oErrorConfig.helpMessage = Common.Messages.PROBLEM_PERSIST_SOLUTION;
            oErrorConfig.errorTitle = Common.Messages.E_REPORT_404;
            oErrorConfig.exception = ex.StackTrace;
            return oErrorConfig;
        }

        public static ErrorConfig Exception(Exception ex)
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = Common.Messages.UNEXPECTED_ERROR;
            oErrorConfig.helpMessage = Common.Messages.PROBLEM_PERSIST_SOLUTION;
            oErrorConfig.errorTitle = Common.Messages.E_500;
            oErrorConfig.exception = ex.StackTrace;
            return oErrorConfig;
        }

        public static ErrorConfig ReportError404()
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = Common.Messages.REPORT_NOT_AVAILABLE;
            oErrorConfig.helpMessage = Common.Messages.PROBLEM_PERSIST_SOLUTION;
            oErrorConfig.errorTitle = Common.Messages.E_REPORT_404;
            return oErrorConfig;
        }

        public static ErrorConfig Error404()
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = Common.Messages.RESOURCE_NOT_AVAILABLE;
            oErrorConfig.helpMessage = Common.Messages.PROBLEM_PERSIST_SOLUTION;
            oErrorConfig.errorTitle = Common.Messages.E_404;
             return oErrorConfig;
        }
        public static ErrorConfig Error404(string message)
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = message;
            oErrorConfig.helpMessage = Common.Messages.PROBLEM_PERSIST_SOLUTION;
            oErrorConfig.errorTitle = Common.Messages.E_404;
            return oErrorConfig;
        }


        public static ErrorConfig unAuthorizedAccess()
        {
            ErrorConfig oErrorConfig = new ErrorConfig();
            oErrorConfig.ErrorMessage = Common.Messages.RESOURCE_UNAUTHORIZED_ACCESS;
            oErrorConfig.helpMessage = Common.Messages.RESOURCE_UNAUTHORIZED_ACCESS_SUB_TEXT;
            oErrorConfig.errorTitle = Common.Messages.E_401;
            return oErrorConfig;
        }


    }
}