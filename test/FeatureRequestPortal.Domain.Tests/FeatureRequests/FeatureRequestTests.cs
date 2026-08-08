using System;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// The aggregate rules do not need a database, so these are plain unit tests.
/// </summary>
public class FeatureRequestTests
{
    private static FeatureRequest CreateFeatureRequest()
    {
        return new FeatureRequest(
            Guid.NewGuid(),
            "Heated steering wheel as standard equipment",
            "Winter mornings would be much better with a heated steering wheel."
        );
    }

    private static string ValidCommentText()
    {
        return new string('a', FeatureRequestConsts.MinCommentTextLength);
    }

    [Fact]
    public void Should_Be_Created_As_Pending_With_No_Votes()
    {
        var featureRequest = CreateFeatureRequest();

        featureRequest.Status.ShouldBe(FeatureRequestStatus.Pending);
        featureRequest.VoteCount.ShouldBe(0);
        featureRequest.Votes.ShouldBeEmpty();
    }

    [Fact]
    public void AddVote_Should_Increase_VoteCount()
    {
        var featureRequest = CreateFeatureRequest();
        var userId = Guid.NewGuid();

        featureRequest.AddVote(Guid.NewGuid(), userId);

        featureRequest.VoteCount.ShouldBe(1);
        featureRequest.Votes.Count.ShouldBe(1);
        featureRequest.HasVoted(userId).ShouldBeTrue();
    }

    [Fact]
    public void AddVote_Should_Throw_When_The_Same_User_Votes_Twice()
    {
        var featureRequest = CreateFeatureRequest();
        var userId = Guid.NewGuid();
        featureRequest.AddVote(Guid.NewGuid(), userId);

        var exception = Should.Throw<BusinessException>(
            () => featureRequest.AddVote(Guid.NewGuid(), userId));

        exception.Code.ShouldBe(FeatureRequestPortalDomainErrorCodes.AlreadyVoted);
        featureRequest.VoteCount.ShouldBe(1);
    }

    [Fact]
    public void AddVote_Should_Allow_Different_Users()
    {
        var featureRequest = CreateFeatureRequest();

        featureRequest.AddVote(Guid.NewGuid(), Guid.NewGuid());
        featureRequest.AddVote(Guid.NewGuid(), Guid.NewGuid());

        featureRequest.VoteCount.ShouldBe(2);
    }

    [Fact]
    public void Should_Not_Accept_A_Title_Shorter_Than_The_Minimum()
    {
        Should.Throw<ArgumentException>(
            () => new FeatureRequest(Guid.NewGuid(), "Too short", "A description."));
    }

    [Fact]
    public void Should_Not_Accept_A_Title_Longer_Than_The_Maximum()
    {
        var title = new string('a', FeatureRequestConsts.MaxTitleLength + 1);

        Should.Throw<ArgumentException>(
            () => new FeatureRequest(Guid.NewGuid(), title, "A description."));
    }

    [Fact]
    public void RemoveVote_Should_Decrease_VoteCount_And_Drop_The_Vote()
    {
        var featureRequest = CreateFeatureRequest();
        var userId = Guid.NewGuid();
        featureRequest.AddVote(Guid.NewGuid(), userId);

        featureRequest.RemoveVote(userId);

        featureRequest.VoteCount.ShouldBe(0);
        featureRequest.Votes.ShouldBeEmpty();
        featureRequest.HasVoted(userId).ShouldBeFalse();
    }

    [Fact]
    public void RemoveVote_Should_Throw_When_The_User_Has_Not_Voted()
    {
        var featureRequest = CreateFeatureRequest();

        var exception = Should.Throw<BusinessException>(
            () => featureRequest.RemoveVote(Guid.NewGuid()));

        exception.Code.ShouldBe(FeatureRequestPortalDomainErrorCodes.NotVoted);
        featureRequest.VoteCount.ShouldBe(0);
    }

    [Fact]
    public void RemoveVote_Should_Only_Drop_The_Vote_Of_The_Given_User()
    {
        var featureRequest = CreateFeatureRequest();
        var mine = Guid.NewGuid();
        var someoneElse = Guid.NewGuid();
        featureRequest.AddVote(Guid.NewGuid(), mine);
        featureRequest.AddVote(Guid.NewGuid(), someoneElse);

        featureRequest.RemoveVote(mine);

        featureRequest.VoteCount.ShouldBe(1);
        featureRequest.HasVoted(mine).ShouldBeFalse();
        featureRequest.HasVoted(someoneElse).ShouldBeTrue();
    }

    [Fact]
    public void RemoveVote_Should_Allow_The_User_To_Vote_Again()
    {
        var featureRequest = CreateFeatureRequest();
        var userId = Guid.NewGuid();
        featureRequest.AddVote(Guid.NewGuid(), userId);
        featureRequest.RemoveVote(userId);

        featureRequest.AddVote(Guid.NewGuid(), userId);

        featureRequest.VoteCount.ShouldBe(1);
        featureRequest.HasVoted(userId).ShouldBeTrue();
    }

    [Fact]
    public void AddComment_Should_Add_The_Comment_To_The_Aggregate()
    {
        var featureRequest = CreateFeatureRequest();

        var comment = featureRequest.AddComment(Guid.NewGuid(), ValidCommentText());

        featureRequest.Comments.Count.ShouldBe(1);
        comment.FeatureRequestId.ShouldBe(featureRequest.Id);
    }

    [Fact]
    public void AddComment_Should_Reject_Text_Below_The_Minimum_Length()
    {
        var featureRequest = CreateFeatureRequest();
        var tooShort = new string('a', FeatureRequestConsts.MinCommentTextLength - 1);

        Should.Throw<ArgumentException>(
            () => featureRequest.AddComment(Guid.NewGuid(), tooShort));
    }

    [Fact]
    public void AddComment_Should_Reject_Empty_Text()
    {
        var featureRequest = CreateFeatureRequest();

        Should.Throw<ArgumentException>(
            () => featureRequest.AddComment(Guid.NewGuid(), "   "));
    }

    [Fact]
    public void SetStatus_Should_Update_The_Status()
    {
        var featureRequest = CreateFeatureRequest();

        featureRequest.SetStatus(FeatureRequestStatus.Approved);

        featureRequest.Status.ShouldBe(FeatureRequestStatus.Approved);
    }
}
