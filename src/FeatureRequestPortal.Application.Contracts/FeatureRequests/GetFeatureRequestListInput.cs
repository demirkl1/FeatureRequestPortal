using Volo.Abp.Application.Dtos;

namespace FeatureRequestPortal.FeatureRequests;

public class GetFeatureRequestListInput : PagedAndSortedResultRequestDto
{
    public FeatureRequestStatus? Status { get; set; }

    public GetFeatureRequestListInput()
    {
        MaxResultCount = FeatureRequestConsts.DefaultPageSize;
    }
}
