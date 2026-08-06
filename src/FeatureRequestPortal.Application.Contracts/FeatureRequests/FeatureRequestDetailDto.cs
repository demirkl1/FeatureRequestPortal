using System.Collections.Generic;

namespace FeatureRequestPortal.FeatureRequests;

public class FeatureRequestDetailDto : FeatureRequestDto
{
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// True when the current user already voted, so the UI can disable the vote button.
    /// </summary>
    public bool HasCurrentUserVoted { get; set; }

    public List<CommentDto> Comments { get; set; } = new();
}
