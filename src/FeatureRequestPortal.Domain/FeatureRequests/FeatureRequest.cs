using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// Aggregate root of a feature request. Votes and comments are only added through
/// this class, so <see cref="VoteCount"/> can never drift away from <see cref="Votes"/>.
/// Inherits FullAuditedAggregateRoot to get soft-delete.
/// </summary>
public class FeatureRequest : FullAuditedAggregateRoot<Guid>
{
    public virtual string Title { get; private set; }

    public virtual string Description { get; private set; }

    public virtual FeatureRequestStatus Status { get; private set; }

    public virtual int VoteCount { get; private set; }

    public virtual ICollection<Vote> Votes { get; protected set; }

    public virtual ICollection<Comment> Comments { get; protected set; }

    protected FeatureRequest()
    {
        Title = string.Empty;
        Description = string.Empty;
        Votes = new List<Vote>();
        Comments = new List<Comment>();
    }

    public FeatureRequest(
        Guid id,
        string title,
        string description,
        FeatureRequestStatus status = FeatureRequestStatus.Pending)
        : base(id)
    {
        Title = ValidateTitle(title);
        Description = ValidateDescription(description);
        Status = status;
        VoteCount = 0;
        Votes = new List<Vote>();
        Comments = new List<Comment>();
    }

    public virtual FeatureRequest SetTitle(string title)
    {
        Title = ValidateTitle(title);
        return this;
    }

    public virtual FeatureRequest SetDescription(string description)
    {
        Description = ValidateDescription(description);
        return this;
    }

    public virtual FeatureRequest SetStatus(FeatureRequestStatus status)
    {
        Status = status;
        return this;
    }

    /// <summary>
    /// Adds an up-vote for the given user. A user can vote only once per feature request.
    /// </summary>
    /// <exception cref="BusinessException">Thrown when the user has already voted.</exception>
    public virtual Vote AddVote(Guid voteId, Guid userId)
    {
        if (HasVoted(userId))
        {
            throw new BusinessException(FeatureRequestPortalDomainErrorCodes.AlreadyVoted)
                .WithData("FeatureRequestId", Id);
        }

        var vote = new Vote(voteId, Id, userId);

        Votes.Add(vote);
        VoteCount++;

        return vote;
    }

    /// <summary>
    /// Withdraws the user's up-vote, so a mis-click can be undone. The vote row is removed
    /// outright rather than soft-deleted, otherwise the unique index on
    /// (FeatureRequestId, CreatorId) would stop the same user from voting again later.
    /// </summary>
    /// <exception cref="BusinessException">Thrown when the user has not voted.</exception>
    public virtual Vote RemoveVote(Guid userId)
    {
        var vote = Votes.FirstOrDefault(vote => vote.CreatorId == userId);

        if (vote == null)
        {
            throw new BusinessException(FeatureRequestPortalDomainErrorCodes.NotVoted)
                .WithData("FeatureRequestId", Id);
        }

        Votes.Remove(vote);
        VoteCount--;

        return vote;
    }

    public virtual bool HasVoted(Guid userId)
    {
        return Votes.Any(vote => vote.CreatorId == userId);
    }

    public virtual Comment AddComment(Guid commentId, string text, Guid? userId = null)
    {
        var comment = new Comment(commentId, Id, text, userId);

        Comments.Add(comment);

        return comment;
    }

    private static string ValidateTitle(string title)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));

        return Check.Length(
            title,
            nameof(title),
            FeatureRequestConsts.MaxTitleLength,
            FeatureRequestConsts.MinTitleLength
        )!;
    }

    private static string ValidateDescription(string description)
    {
        return Check.Length(
            description,
            nameof(description),
            FeatureRequestConsts.MaxDescriptionLength
        ) ?? string.Empty;
    }
}
