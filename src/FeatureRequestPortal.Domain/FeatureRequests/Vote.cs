using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// A single up-vote of a user for a <see cref="FeatureRequest"/>.
/// Instances are only created by <see cref="FeatureRequest.AddVote"/>.
/// </summary>
public class Vote : CreationAuditedEntity<Guid>
{
    public virtual Guid FeatureRequestId { get; protected set; }

    protected Vote()
    {
    }

    /* CreatorId is normally set by the ABP audit system on insert, but the duplicate
     * vote check needs it right away. Its setter is protected in CreationAuditedEntity,
     * so it can only be assigned from inside this class. */
    internal Vote(Guid id, Guid featureRequestId, Guid? creatorId = null)
        : base(id)
    {
        FeatureRequestId = featureRequestId;
        CreatorId = creatorId;
    }
}
