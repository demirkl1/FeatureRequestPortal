using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace FeatureRequestPortal.Pages;

public class Index_Tests : FeatureRequestPortalWebTestBase
{
    [Fact]
    public async Task Welcome_Page()
    {
        var response = await GetResponseAsStringAsync("/");
        response.ShouldNotBeNull();
    }
}
