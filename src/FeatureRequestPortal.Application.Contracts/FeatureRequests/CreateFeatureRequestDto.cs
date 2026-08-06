using System.ComponentModel.DataAnnotations;

namespace FeatureRequestPortal.FeatureRequests;

public class CreateFeatureRequestDto
{
    [Required]
    [StringLength(FeatureRequestConsts.MaxTitleLength, MinimumLength = FeatureRequestConsts.MinTitleLength)]
    public string Title { get; set; } = string.Empty;

    [StringLength(FeatureRequestConsts.MaxDescriptionLength)]
    [DataType(DataType.MultilineText)]
    public string Description { get; set; } = string.Empty;
}
