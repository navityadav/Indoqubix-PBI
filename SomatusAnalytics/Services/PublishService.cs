using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using System;
using System.Linq;

namespace SomatusAnalytics.Services
{
    public class PublishService
    {
        public string getReportInfo(int userId, string reportURI)
        {
            using (DBModel db = new DBModel())
            {
                var publishedURLMetaInfo = 
                    db.ac_report_published.Where(a => a.user_id == userId && a.published_uri.ToString().Equals(reportURI)).FirstOrDefault<ac_report_published>();
                // return publishedURLMetaInfo;
                if (publishedURLMetaInfo == null)
                {
                    return Messages.E_404;
                }
                else
                {
                    if (publishedURLMetaInfo.report_type.Equals(Messages.REPORT_TYPE_POWERBI))
                    {
                        return "/SI/Report/" + publishedURLMetaInfo.ref_uri;
                    }
                    else if (publishedURLMetaInfo.report_type.Equals(Messages.REPORT_DOWNLOAD))
                    {
                        return "/download/file/" + publishedURLMetaInfo.ref_uri;
                    }
                    else if (publishedURLMetaInfo.report_type.Equals(Messages.REPORT_PDF))
                    {
                        return "/download/previewpdf/" + publishedURLMetaInfo.ref_uri;
                    }
                    else if (publishedURLMetaInfo.report_type.Equals(Messages.REPORT_TYPE_SELF_SERVICE))
                    {
                        return "/reportbuilder/display/" + publishedURLMetaInfo.ref_uri;
                    }
                    else { 
                        return publishedURLMetaInfo.ref_uri;
                    }

                }


            }
        }

        public static string publishURL(int userId, int clientId, string reportURI,string  reportType)
        {
            using (DBModel db = new DBModel())
            {
                var ac_report_published = new ac_report_published();
                ac_report_published.published_uri = Guid.NewGuid();

                ac_report_published.user_id = userId;
                ac_report_published.ref_uri = reportURI;
                ac_report_published.published_on = DateTime.Now;
                ac_report_published.report_type = reportType;
                ac_report_published.client_id = clientId;
                db.ac_report_published.Add(ac_report_published);
                db.SaveChanges();

                return ac_report_published.published_uri.ToString();
            }

        }
    }
}