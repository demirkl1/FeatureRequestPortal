using System.Threading.Tasks;

namespace FeatureRequestPortal.Data;

public interface IFeatureRequestPortalDbSchemaMigrator
{
    Task MigrateAsync();
}
