using System.Threading.Tasks;
using FeatureRequestPortal.FeatureRequests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeatureRequestPortal.Web.Pages.FeatureRequests;

/// <summary>Any authenticated user may create a feature request.</summary>
[Authorize]
public class CreateModel : FeatureRequestPortalPageModel
{
    [BindProperty]
    public CreateFeatureRequestDto FeatureRequest { get; set; } = new();

    private readonly IFeatureRequestAppService _featureRequestAppService;

    public CreateModel(IFeatureRequestAppService featureRequestAppService)
    {
        _featureRequestAppService = featureRequestAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var created = await _featureRequestAppService.CreateAsync(FeatureRequest);

        return RedirectToPage("./Detail", new { id = created.Id });
    }
}
