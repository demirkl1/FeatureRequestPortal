using System.ComponentModel.DataAnnotations;

namespace FeatureRequestPortal.FeatureRequests;

public class UpdateFeatureRequestStatusDto
{
    [Required]
    [EnumDataType(typeof(FeatureRequestStatus))]
    public FeatureRequestStatus Status { get; set; }
}
