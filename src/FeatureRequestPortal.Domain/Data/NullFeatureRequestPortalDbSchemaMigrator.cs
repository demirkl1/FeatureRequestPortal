using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace FeatureRequestPortal.Data;

/* This is used if database provider does't define
 * IFeatureRequestPortalDbSchemaMigrator implementation.
 */
public class NullFeatureRequestPortalDbSchemaMigrator : IFeatureRequestPortalDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
