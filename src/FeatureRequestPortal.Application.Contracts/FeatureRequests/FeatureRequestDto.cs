using System;
using Volo.Abp.Application.Dtos;

namespace FeatureRequestPortal.FeatureRequests;

public class FeatureRequestDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = string.Empty;

    public FeatureRequestStatus Status { get; set; }

    public int VoteCount { get; set; }
}
