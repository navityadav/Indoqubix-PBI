using SomatusAnalytics.Models;
using System.Threading.Tasks;

namespace SomatusAnalytics.Services
{
    public interface IEmbedService
    {
        EmbedConfig EmbedConfig { get; }
        TileEmbedConfig TileEmbedConfig { get; }

        Task<bool> EmbedReport(string username, string roles);
        Task<bool> EmbedDashboard();
        Task<bool> EmbedTile();
    }
}
