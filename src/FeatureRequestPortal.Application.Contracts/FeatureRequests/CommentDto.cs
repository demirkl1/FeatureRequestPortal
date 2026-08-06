using System;
using Volo.Abp.Application.Dtos;

namespace FeatureRequestPortal.FeatureRequests;

public class CommentDto : CreationAuditedEntityDto<Guid>
{
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Resolved from the identity module so the detail page can show who wrote the comment.
    /// </summary>
    public string? CreatorName { get; set; }
}
