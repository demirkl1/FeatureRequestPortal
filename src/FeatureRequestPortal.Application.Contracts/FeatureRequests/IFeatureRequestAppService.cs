using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace FeatureRequestPortal.FeatureRequests;

public interface IFeatureRequestAppService : IApplicationService
{
    /// <summary>Open to anonymous visitors, who only get approved requests.</summary>
    Task<PagedResultDto<FeatureRequestDto>> GetListAsync(GetFeatureRequestListInput input);

    /// <summary>Open to anonymous visitors, who can only open approved requests.</summary>
    Task<FeatureRequestDetailDto> GetAsync(Guid id);

    /// <summary>Any authenticated user; the request is created with the Pending status.</summary>
    Task<FeatureRequestDto> CreateAsync(CreateFeatureRequestDto input);

    /// <summary>One up-vote per user; a second call fails with a business exception.</summary>
    Task VoteAsync(Guid id);

    Task<CommentDto> AddCommentAsync(Guid id, CreateCommentDto input);

    /// <summary>Admin only.</summary>
    Task<FeatureRequestDto> ChangeStatusAsync(Guid id, UpdateFeatureRequestStatusDto input);

    /// <summary>Admin only; soft-deletes the request.</summary>
    Task DeleteAsync(Guid id);
}
