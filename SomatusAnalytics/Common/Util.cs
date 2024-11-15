using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Services;
using System;
using System.Linq;

namespace SomatusAnalytics.Common
{
    public static class Util
    {
        public static Guid GetParamGuid(string param)
        {
            Guid paramGuid = Guid.Empty;
            Guid.TryParse(param, out paramGuid);
            return paramGuid;
        }

        public static string encode64(string plainString) {

            string base64Encoded;
            byte[] dataBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(plainString);
            base64Encoded = System.Convert.ToBase64String(dataBytes);
            return base64Encoded;    
        }

        public static string decode64(string encodedString)
        {
            string base64Decoded;
            try
            {
                byte[] decodedBytes = System.Convert.FromBase64String(encodedString);
                base64Decoded = System.Text.ASCIIEncoding.ASCII.GetString(decodedBytes);
            }catch (Exception ex)
            {
                base64Decoded = "~";
                return base64Decoded;
            }
            return base64Decoded;
        }

        public static string GetMD5Hash(string password)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider x = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] bs = System.Text.Encoding.Unicode.GetBytes(password);
            bs = x.ComputeHash(bs);
            System.Text.StringBuilder s = new System.Text.StringBuilder();
            foreach (byte b in bs)
            {
                s.Append(b.ToString("x2").ToLower());
            }
            return s.ToString();
        }

        public static string GetBaseUrl()
        {
            return Settings.ENV_URL;
        }

        public static string GetBaseUrl(int clientId)
        {
            AuthService oAuth = new AuthService();
            ac_client_master oClient = oAuth.getClientInfo(clientId);
            string clientDomain = oClient.client_domain;
            return clientDomain;
        }

        public static  DateTime getNextDate(string type, int day)
        {
            var dd = DateTime.Now;

            DateTime datetime = new DateTime(dd.Year, dd.Month, dd.Day, 9, 0, 0, DateTimeKind.Utc);

            if (type.Equals("WEEK"))
            {
                datetime = datetime.AddDays(7 - day);
            }
            else if (type.Equals("MONTH"))
            {
                datetime= datetime.AddMonths(1);
                return new DateTime(datetime.Year, datetime.Month, day);
            }
            else
            {
                datetime = datetime.AddDays(day);
            }
            return datetime;

        }

        /**
         * Util method to check if string contains minimum character of other string
         * 
         */
        public static bool stringMatch(string String1, string String2, int minMatchFrequence) {

            var result = String1.ToLower().ToCharArray().Intersect(String2.ToLower().ToCharArray()).ToList();
            if (result.Count > minMatchFrequence)
            {
                return true;
            }
            else {
                return false;
            }

        }

        public static string generateOtp()
        {
            Random generator = new Random();
            string otp = generator.Next(100000, 1000000).ToString();
            return otp;
        }

        public static string generatedVerificationCode()
        {
            string verificationCode = Guid.NewGuid().ToString();

            verificationCode = encode64(verificationCode + ":" + DateTimeOffset.Now.ToUnixTimeSeconds());
            return verificationCode;
        }

        public static Boolean validateVerificationCode(string verificationCode, int timeLimitInSec)
        {
            verificationCode = decode64(verificationCode);
            string[] verificationCodeElements = verificationCode.Split(':');
            if (verificationCodeElements.Length == 2)
            {
                var timeSpan = DateTimeOffset.Now.ToUnixTimeSeconds() - long.Parse(verificationCodeElements[1]);
                if (timeSpan < timeLimitInSec)
                    return true; 
            }
            return false;
        }

    }
}