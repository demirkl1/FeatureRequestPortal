using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// A comment written on a <see cref="FeatureRequest"/>.
/// Instances are only created by <see cref="FeatureRequest.AddComment"/>.
/// </summary>
public class Comment : CreationAuditedEntity<Guid>
{
    public virtual Guid FeatureRequestId { get; protected set; }

    public virtual string Text { get; protected set; }

    protected Comment()
    {
        Text = string.Empty;
    }

    internal Comment(Guid id, Guid featureRequestId, string text, Guid? creatorId = null)
        : base(id)
    {
        FeatureRequestId = featureRequestId;
        Text = ValidateText(text);
        CreatorId = creatorId;
    }

    private static string ValidateText(string text)
    {
        Check.NotNullOrWhiteSpace(text, nameof(text));

        return Check.Length(
            text,
            nameof(text),
            FeatureRequestConsts.MaxCommentTextLength,
            FeatureRequestConsts.MinCommentTextLength
        )!;
    }
}
