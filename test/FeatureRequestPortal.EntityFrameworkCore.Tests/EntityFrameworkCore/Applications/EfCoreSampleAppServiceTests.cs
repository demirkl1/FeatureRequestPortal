using FeatureRequestPortal.Samples;
using Xunit;

namespace FeatureRequestPortal.EntityFrameworkCore.Applications;

[Collection(FeatureRequestPortalTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<FeatureRequestPortalEntityFrameworkCoreTestModule>
{

}
