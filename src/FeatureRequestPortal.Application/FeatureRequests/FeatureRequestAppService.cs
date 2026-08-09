using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FeatureRequestPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Users;

namespace FeatureRequestPortal.FeatureRequests;

[Authorize]
public class FeatureRequestAppService : FeatureRequestPortalAppService, IFeatureRequestAppService
{
    private readonly IFeatureRequestRepository _featureRequestRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;

    public FeatureRequestAppService(
        IFeatureRequestRepository featureRequestRepository,
        IRepository<IdentityUser, Guid> userRepository)
    {
        _featureRequestRepository = featureRequestRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Anonymous visitors only see approved requests; authenticated users see every status.
    /// </summary>
    [AllowAnonymous]
    public virtual async Task<PagedResultDto<FeatureRequestDto>> GetListAsync(GetFeatureRequestListInput input)
    {
        var onlyApproved = !CurrentUser.IsAuthenticated;

        var totalCount = await _featureRequestRepository.GetCountAsync(input.Status, onlyApproved);

        var featureRequests = await _featureRequestRepository.GetListAsync(
            NormalizeSorting(input.Sorting),
            input.SkipCount,
            NormalizePageSize(input.MaxResultCount),
            input.Status,
            onlyApproved
        );

        return new PagedResultDto<FeatureRequestDto>(
            totalCount,
            ObjectMapper.Map<List<FeatureRequest>, List<FeatureRequestDto>>(featureRequests)
        );
    }

    [AllowAnonymous]
    public virtual async Task<FeatureRequestDetailDto> GetAsync(Guid id)
    {
        var featureRequest = await GetVisibleFeatureRequestAsync(id);

        var dto = ObjectMapper.Map<FeatureRequest, FeatureRequestDetailDto>(featureRequest);

        dto.HasCurrentUserVoted = CurrentUser.Id.HasValue && featureRequest.HasVoted(CurrentUser.Id.Value);
        dto.Comments = await MapCommentsAsync(featureRequest.Comments);

        return dto;
    }

    /// <summary>Any authenticated user may create a request; it starts as Pending.</summary>
    public virtual async Task<FeatureRequestDto> CreateAsync(CreateFeatureRequestDto input)
    {
        var featureRequest = new FeatureRequest(
            GuidGenerator.Create(),
            input.Title,
            input.Description
        );

        await _featureRequestRepository.InsertAsync(featureRequest, autoSave: true);

        return ObjectMapper.Map<FeatureRequest, FeatureRequestDto>(featureRequest);
    }

    /// <summary>
    /// Adds a single up-vote. The aggregate throws when the user has already voted.
    /// </summary>
    public virtual async Task VoteAsync(Guid id)
    {
        var featureRequest = await GetWithDetailsAsync(id);

        featureRequest.AddVote(GuidGenerator.Create(), CurrentUser.GetId());

        await _featureRequestRepository.UpdateAsync(featureRequest, autoSave: true);
    }

    public virtual async Task<CommentDto> AddCommentAsync(Guid id, CreateCommentDto input)
    {
        var featureRequest = await GetWithDetailsAsync(id);

        var comment = featureRequest.AddComment(GuidGenerator.Create(), input.Text, CurrentUser.GetId());

        await _featureRequestRepository.UpdateAsync(featureRequest, autoSave: true);

        var dto = ObjectMapper.Map<Comment, CommentDto>(comment);
        dto.CreatorName = CurrentUser.UserName;

        return dto;
    }

    [Authorize(FeatureRequestPortalPermissions.FeatureRequests.ChangeStatus)]
    public virtual async Task<FeatureRequestDto> ChangeStatusAsync(Guid id, UpdateFeatureRequestStatusDto input)
    {
        var featureRequest = await _featureRequestRepository.GetAsync(id);

        featureRequest.SetStatus(input.Status);

        await _featureRequestRepository.UpdateAsync(featureRequest, autoSave: true);

        return ObjectMapper.Map<FeatureRequest, FeatureRequestDto>(featureRequest);
    }

    /// <summary>Soft-deletes the request, because FeatureRequest is a FullAuditedAggregateRoot.</summary>
    [Authorize(FeatureRequestPortalPermissions.FeatureRequests.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        await _featureRequestRepository.DeleteAsync(id, autoSave: true);
    }

    private async Task<FeatureRequest> GetWithDetailsAsync(Guid id)
    {
        return await _featureRequestRepository.FindWithDetailsAsync(id)
               ?? throw new EntityNotFoundException(typeof(FeatureRequest), id);
    }

    /// <summary>
    /// Hides non-approved requests from anonymous visitors instead of leaking their existence.
    /// </summary>
    private async Task<FeatureRequest> GetVisibleFeatureRequestAsync(Guid id)
    {
        var featureRequest = await GetWithDetailsAsync(id);

        if (!CurrentUser.IsAuthenticated && featureRequest.Status != FeatureRequestStatus.Approved)
        {
            throw new EntityNotFoundException(typeof(FeatureRequest), id);
        }

        return featureRequest;
    }

    /// <summary>
    /// Resolves the comment authors in a single query instead of one query per comment.
    /// </summary>
    private async Task<List<CommentDto>> MapCommentsAsync(ICollection<Comment> comments)
    {
        var dtos = comments
            .OrderBy(comment => comment.CreationTime)
            .Select(ObjectMapper.Map<Comment, CommentDto>)
            .ToList();

        var creatorIds = dtos
            .Where(dto => dto.CreatorId.HasValue)
            .Select(dto => dto.CreatorId!.Value)
            .Distinct()
            .ToList();

        if (creatorIds.Count == 0)
        {
            return dtos;
        }

        var users = await _userRepository.GetListAsync(user => creatorIds.Contains(user.Id));
        var userNames = users.ToDictionary(user => user.Id, user => user.UserName);

        foreach (var dto in dtos.Where(dto => dto.CreatorId.HasValue))
        {
            dto.CreatorName = userNames.GetOrDefault(dto.CreatorId!.Value);
        }

        return dtos;
    }

    /// <summary>
    /// Only the page sizes offered by the UI are honoured. Without this a caller could ask for
    /// an arbitrarily large page and turn the list endpoint into a full table dump.
    /// </summary>
    private static int NormalizePageSize(int maxResultCount)
    {
        return FeatureRequestConsts.AllowedPageSizes.Contains(maxResultCount)
            ? maxResultCount
            : FeatureRequestConsts.DefaultPageSize;
    }

    /// <summary>
    /// Only the two orderings offered by the UI are accepted, so the dynamic LINQ
    /// sorting expression can never come straight from the query string.
    /// </summary>
    private static string NormalizeSorting(string? sorting)
    {
        if (sorting.IsNullOrWhiteSpace())
        {
            return $"{nameof(FeatureRequest.CreationTime)} desc";
        }

        var descending = sorting!.Contains("desc", StringComparison.OrdinalIgnoreCase);
        var direction = descending ? "desc" : "asc";

        return sorting.Contains(nameof(FeatureRequest.VoteCount), StringComparison.OrdinalIgnoreCase)
            ? $"{nameof(FeatureRequest.VoteCount)} {direction}"
            : $"{nameof(FeatureRequest.CreationTime)} {direction}";
    }
}
