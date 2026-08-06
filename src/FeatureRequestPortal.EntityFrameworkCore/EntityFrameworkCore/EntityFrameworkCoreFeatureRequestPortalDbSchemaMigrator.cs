using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FeatureRequestPortal.Data;
using Volo.Abp.DependencyInjection;

namespace FeatureRequestPortal.EntityFrameworkCore;

public class EntityFrameworkCoreFeatureRequestPortalDbSchemaMigrator
    : IFeatureRequestPortalDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreFeatureRequestPortalDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the FeatureRequestPortalDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<FeatureRequestPortalDbContext>()
            .Database
            .MigrateAsync();
    }
}
