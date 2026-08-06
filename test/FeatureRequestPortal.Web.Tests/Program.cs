using Microsoft.AspNetCore.Builder;
using FeatureRequestPortal;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();

builder.Environment.ContentRootPath = GetWebProjectContentRootPathHelper.Get("FeatureRequestPortal.Web.csproj");
await builder.RunAbpModuleAsync<FeatureRequestPortalWebTestModule>(applicationName: "FeatureRequestPortal.Web" );

public partial class Program
{
}
