using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using FeatureRequestPortal.FeatureRequests;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace FeatureRequestPortal.EntityFrameworkCore.FeatureRequests;

public class EfCoreFeatureRequestRepository :
    EfCoreRepository<FeatureRequestPortalDbContext, FeatureRequest, Guid>,
    IFeatureRequestRepository
{
    public EfCoreFeatureRequestRepository(IDbContextProvider<FeatureRequestPortalDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<List<FeatureRequest>> GetListAsync(
        string? sorting = null,
        int skipCount = 0,
        int maxResultCount = FeatureRequestConsts.DefaultPageSize,
        FeatureRequestStatus? status = null,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default)
    {
        var query = await GetFilteredQueryableAsync(status, onlyApproved);

        return await query
            .OrderBy(sorting.IsNullOrWhiteSpace()
                ? $"{nameof(FeatureRequest.CreationTime)} desc"
                : sorting!)
            .Skip(skipCount)
            .Take(maxResultCount)
            .ToListAsync(GetCancellationToken(cancellationToken));
    }

    public async Task<long> GetCountAsync(
        FeatureRequestStatus? status = null,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default)
    {
        var query = await GetFilteredQueryableAsync(status, onlyApproved);

        return await query.LongCountAsync(GetCancellationToken(cancellationToken));
    }

    public async Task<FeatureRequest?> FindWithDetailsAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync())
            .Include(x => x.Votes)
            .Include(x => x.Comments)
            .FirstOrDefaultAsync(x => x.Id == id, GetCancellationToken(cancellationToken));
    }

    private async Task<IQueryable<FeatureRequest>> GetFilteredQueryableAsync(
        FeatureRequestStatus? status,
        bool onlyApproved)
    {
        return (await GetQueryableAsync())
            /* Anonymous visitors are only allowed to see approved requests. */
            .WhereIf(onlyApproved, x => x.Status == FeatureRequestStatus.Approved)
            .WhereIf(status.HasValue, x => x.Status == status!.Value);
    }
}
