using System;
using System.Linq;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Modularity;
using Volo.Abp.Users;
using Volo.Abp.Validation;
using Xunit;

namespace FeatureRequestPortal.FeatureRequests;

public abstract class FeatureRequestAppServiceTests<TStartupModule> : FeatureRequestPortalApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IFeatureRequestAppService _featureRequestAppService;
    private readonly ICurrentUser _currentUser;

    protected FeatureRequestAppServiceTests()
    {
        _featureRequestAppService = GetRequiredService<IFeatureRequestAppService>();
        _currentUser = GetRequiredService<ICurrentUser>();
    }

    private static CreateFeatureRequestDto NewFeatureRequest(string? title = null)
    {
        return new CreateFeatureRequestDto
        {
            Title = title ?? "Wireless charging pad in the center console",
            Description = "A charging pad would remove the need for cables on daily commutes."
        };
    }

    private static string ValidCommentText()
    {
        return new string('a', FeatureRequestConsts.MinCommentTextLength);
    }

    [Fact]
    public async Task Should_Page_The_List_With_Fifteen_Rows()
    {
        var result = await _featureRequestAppService.GetListAsync(new GetFeatureRequestListInput());

        result.TotalCount.ShouldBeGreaterThan(FeatureRequestConsts.DefaultPageSize);
        result.Items.Count.ShouldBe(FeatureRequestConsts.DefaultPageSize);
    }

    [Fact]
    public async Task Should_Sort_By_Newest_First_By_Default()
    {
        var result = await _featureRequestAppService.GetListAsync(new GetFeatureRequestListInput());

        result.Items
            .Select(item => item.CreationTime)
            .ShouldBe(result.Items.Select(item => item.CreationTime).OrderByDescending(time => time));
    }

    [Fact]
    public async Task Should_Sort_By_Vote_Count_When_Requested()
    {
        var result = await _featureRequestAppService.GetListAsync(
            new GetFeatureRequestListInput { Sorting = "voteCount DESC" });

        result.Items
            .Select(item => item.VoteCount)
            .ShouldBe(result.Items.Select(item => item.VoteCount).OrderByDescending(count => count));
    }

    [Fact]
    public async Task Should_Filter_By_Status()
    {
        var result = await _featureRequestAppService.GetListAsync(
            new GetFeatureRequestListInput { Status = FeatureRequestStatus.Rejected });

        result.TotalCount.ShouldBeGreaterThan(0);
        result.Items.ShouldAllBe(item => item.Status == FeatureRequestStatus.Rejected);
    }

    [Fact]
    public async Task Should_Create_A_Feature_Request_As_Pending()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        created.Status.ShouldBe(FeatureRequestStatus.Pending);
        created.VoteCount.ShouldBe(0);

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.Title.ShouldBe(NewFeatureRequest().Title);
    }

    [Fact]
    public async Task Should_Not_Create_A_Feature_Request_With_A_Short_Title()
    {
        await Should.ThrowAsync<AbpValidationException>(
            async () => await _featureRequestAppService.CreateAsync(NewFeatureRequest("Short")));
    }

    [Fact]
    public async Task Should_Increase_The_Vote_Count()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        await _featureRequestAppService.VoteAsync(created.Id);

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.VoteCount.ShouldBe(1);
        detail.HasCurrentUserVoted.ShouldBeTrue();
    }

    [Fact]
    public async Task Should_Not_Allow_The_Same_User_To_Vote_Twice()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());
        await _featureRequestAppService.VoteAsync(created.Id);

        var exception = await Should.ThrowAsync<BusinessException>(
            async () => await _featureRequestAppService.VoteAsync(created.Id));

        exception.Code.ShouldBe(FeatureRequestPortalDomainErrorCodes.AlreadyVoted);

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.VoteCount.ShouldBe(1);
    }

    [Fact]
    public async Task Should_Withdraw_The_Vote()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());
        await _featureRequestAppService.VoteAsync(created.Id);

        await _featureRequestAppService.RemoveVoteAsync(created.Id);

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.VoteCount.ShouldBe(0);
        detail.HasCurrentUserVoted.ShouldBeFalse();
    }

    [Fact]
    public async Task Should_Not_Withdraw_A_Vote_That_Was_Never_Cast()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        var exception = await Should.ThrowAsync<BusinessException>(
            async () => await _featureRequestAppService.RemoveVoteAsync(created.Id));

        exception.Code.ShouldBe(FeatureRequestPortalDomainErrorCodes.NotVoted);
    }

    /// <summary>
    /// Guards the unique index on (FeatureRequestId, CreatorId): withdrawing has to delete the
    /// vote row outright, otherwise the second vote would hit a duplicate key error.
    /// </summary>
    [Fact]
    public async Task Should_Allow_Voting_Again_After_Withdrawing()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());
        await _featureRequestAppService.VoteAsync(created.Id);
        await _featureRequestAppService.RemoveVoteAsync(created.Id);

        await _featureRequestAppService.VoteAsync(created.Id);

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.VoteCount.ShouldBe(1);
        detail.HasCurrentUserVoted.ShouldBeTrue();
    }

    [Fact]
    public async Task Should_Honour_An_Offered_Page_Size()
    {
        var result = await _featureRequestAppService.GetListAsync(
            new GetFeatureRequestListInput { MaxResultCount = 30 });

        result.Items.Count.ShouldBeGreaterThan(FeatureRequestConsts.DefaultPageSize);
        result.Items.Count.ShouldBeLessThanOrEqualTo(30);
    }

    [Fact]
    public async Task Should_Fall_Back_To_The_Default_Page_Size_For_An_Unoffered_One()
    {
        var result = await _featureRequestAppService.GetListAsync(
            new GetFeatureRequestListInput { MaxResultCount = 999 });

        result.Items.Count.ShouldBe(FeatureRequestConsts.DefaultPageSize);
    }

    [Fact]
    public async Task Should_Add_A_Comment()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        var comment = await _featureRequestAppService.AddCommentAsync(
            created.Id,
            new CreateCommentDto { Text = ValidCommentText() });

        comment.Text.ShouldBe(ValidCommentText());
        comment.CreatorName.ShouldBe("admin");

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.Comments.Count.ShouldBe(1);
        /* The fake test principal is not a real identity user, so only the id can be
         * verified here; the display name is resolved from the identity module. */
        detail.Comments.Single().CreatorId.ShouldBe(_currentUser.Id);
    }

    [Fact]
    public async Task Should_Not_Add_A_Comment_Shorter_Than_The_Minimum_Length()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());
        var tooShort = new string('a', FeatureRequestConsts.MinCommentTextLength - 1);

        await Should.ThrowAsync<AbpValidationException>(
            async () => await _featureRequestAppService.AddCommentAsync(
                created.Id,
                new CreateCommentDto { Text = tooShort }));
    }

    [Fact]
    public async Task Should_Change_The_Status()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        await _featureRequestAppService.ChangeStatusAsync(
            created.Id,
            new UpdateFeatureRequestStatusDto { Status = FeatureRequestStatus.Approved });

        var detail = await _featureRequestAppService.GetAsync(created.Id);
        detail.Status.ShouldBe(FeatureRequestStatus.Approved);
    }

    [Fact]
    public async Task Should_Soft_Delete_A_Feature_Request()
    {
        var created = await _featureRequestAppService.CreateAsync(NewFeatureRequest());

        await _featureRequestAppService.DeleteAsync(created.Id);

        await Should.ThrowAsync<Volo.Abp.Domain.Entities.EntityNotFoundException>(
            async () => await _featureRequestAppService.GetAsync(created.Id));
    }
}
