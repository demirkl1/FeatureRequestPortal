using FeatureRequestPortal.Samples;
using Xunit;

namespace FeatureRequestPortal.EntityFrameworkCore.Domains;

[Collection(FeatureRequestPortalTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<FeatureRequestPortalEntityFrameworkCoreTestModule>
{

}
