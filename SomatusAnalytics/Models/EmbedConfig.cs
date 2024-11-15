using Microsoft.PowerBI.Api.Models;
using System;
using System.Collections.Generic;

namespace SomatusAnalytics.Models
{
    public class EmbedConfig
    {
        public string Id { get; set; }

        public string reportTitle { get; set; }

        public string reportURI { get; set; }

        public string showTab { get; set; }

        public string showFilter { get; set; }

        public string EmbedUrl { get; set; }

        public EmbedToken EmbedToken { get; set; }

        public int MinutesToExpiration
        {
            get
            {
                var minutesToExpiration = EmbedToken.Expiration - DateTime.UtcNow;
                return (int)minutesToExpiration.TotalMinutes;
            }
        }

        public bool? IsEffectiveIdentityRolesRequired { get; set; }

        public bool? IsEffectiveIdentityRequired { get; set; }

        public bool EnableRLS { get; set; }

        public string Username { get; set; }

        public string Roles { get; set; }

        public string ErrorMessage { get; internal set; }
        public List<PowerBIReportFilter> PagerReportFilters { set; get; }
    }
}
