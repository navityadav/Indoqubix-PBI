using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace SomatusAnalytics.Common
{
    public static class SendMail
    {
        public async static Task<Boolean> Send(string template, string email, Dictionary<string, string> emailContent, Dictionary<string, string> subjectContent)
        {
            var emailTemplate = SendMail.getEmailContent(template);
            var body = getString(emailTemplate.template_content, emailContent);
            var subject = getString(emailTemplate.subject, subjectContent);

            return await SendMail.SendEmail(email, body, subject);
        }

        public async static Task<Boolean> Send(string template, string email, Dictionary<string, string> emailContent)
        {
            var emailTemplate = SendMail.getEmailContent(template);
            var body = getString(emailTemplate.template_content, emailContent);
            return await SendMail.SendEmail(email, body, emailTemplate.subject);

        }

        internal static string getString(string baseString, Dictionary<string, string> values)
        {
            
            // Loop over items in collection.
            foreach (KeyValuePair<string, string> pair in values)
            {
                baseString = baseString.Replace(pair.Key, pair.Value);
            }
            return baseString;
        }


       internal static async Task<Boolean> SendEmail( string email,string body, string subject)
       {
            /** Get Email Content */
            var msg = new MailMessage();
            msg.To.Add(email);
           
            msg.From = new MailAddress(Settings.EMAIL_FROM, Settings.EMAIL_FROM_NAME);
            msg.IsBodyHtml = true; //HTML email  
           
            msg.Body = body;
            msg.Subject = subject;

            SmtpClient smtpClient = new SmtpClient(Settings.EMAIL_SMTP, Convert.ToInt32(Settings.EMAIL_PORT));
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(Settings.EMAIL_USERNAME, Settings.EMAIL_PASSWORD);
            smtpClient.Credentials = credentials;
            smtpClient.EnableSsl = true;

            smtpClient.Send(msg);
            return true;
        }

        public static ac_email_template getEmailContent(string template)
        {
            using (DBModel db = new DBModel())
            {
                var emailTemplate = db.ac_email_template.Where(a => a.template_name == template && a.mode == "EMAIL")
                       .FirstOrDefault<ac_email_template>();

                return emailTemplate;
            }
        }
    }
}