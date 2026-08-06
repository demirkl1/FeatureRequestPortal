using System;
using System.Collections.Generic;
using System.Linq;
using FeatureRequestPortal.FeatureRequests;

namespace FeatureRequestPortal.Web.Pages;

public class IndexModel : FeatureRequestPortalPageModel
{
    public IReadOnlyList<FeatureRequestStatus> Statuses { get; private set; } = Array.Empty<FeatureRequestStatus>();

    public void OnGet()
    {
        Statuses = Enum.GetValues<FeatureRequestStatus>().ToList();
    }
}
