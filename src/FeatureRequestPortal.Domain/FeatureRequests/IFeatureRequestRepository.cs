using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace FeatureRequestPortal.FeatureRequests;

public interface IFeatureRequestRepository : IRepository<FeatureRequest, Guid>
{
    /// <param name="onlyApproved">
    /// True for anonymous visitors: they may only see approved feature requests.
    /// </param>
    Task<List<FeatureRequest>> GetListAsync(
        string? sorting = null,
        int skipCount = 0,
        int maxResultCount = FeatureRequestConsts.DefaultPageSize,
        FeatureRequestStatus? status = null,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default
    );

    Task<long> GetCountAsync(
        FeatureRequestStatus? status = null,
        bool onlyApproved = false,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Loads the aggregate together with its votes and comments.
    /// </summary>
    Task<FeatureRequest?> FindWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}
