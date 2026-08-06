using System.ComponentModel.DataAnnotations;

namespace FeatureRequestPortal.FeatureRequests;

public class CreateCommentDto
{
    /* The requirements document asks for a 100 character minimum. */
    [Required]
    [StringLength(
        FeatureRequestConsts.MaxCommentTextLength,
        MinimumLength = FeatureRequestConsts.MinCommentTextLength)]
    [DataType(DataType.MultilineText)]
    public string Text { get; set; } = string.Empty;
}
