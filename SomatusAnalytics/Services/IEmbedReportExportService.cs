using SomatusAnalytics.Models;
using System.Threading.Tasks;

namespace SomatusAnalytics.Services
{
    public interface IEmbedReportExportService
    {
        EmbedConfig EmbedConfig { get; }


        Task<bool> ExportReport(string userName, string roles);
      
    }
}
