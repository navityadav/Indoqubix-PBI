using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SomatusAnalytics.Models
{
    public class ExportedFile
    {
        public Stream FileStream;
        public string ReportName;
        public string FileExtension;
    }
}