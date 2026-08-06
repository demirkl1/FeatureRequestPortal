using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FeatureRequestPortal.FeatureRequests;
using FeatureRequestPortal.Permissions;
using FeatureRequestPortal.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace FeatureRequestPortal.Web.Pages.FeatureRequests;

public class DetailModel : FeatureRequestPortalPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateCommentDto NewComment { get; set; } = new();

    [BindProperty]
    public FeatureRequestStatus NewStatus { get; set; }

    public FeatureRequestDetailDto FeatureRequest { get; private set; } = new();

    public IReadOnlyList<FeatureRequestStatus> Statuses { get; private set; } = Array.Empty<FeatureRequestStatus>();

    public bool CanChangeStatus { get; private set; }

    public bool CanDelete { get; private set; }

    /// <summary>
    /// Built here because IHtmlLocalizer.Value returns the raw resource string, so the
    /// {0} placeholder would reach the confirmation dialog unformatted.
    /// </summary>
    public string DeleteConfirmationMessage { get; private set; } = string.Empty;

    private readonly IFeatureRequestAppService _featureRequestAppService;

    public DetailModel(IFeatureRequestAppService featureRequestAppService)
    {
        _featureRequestAppService = featureRequestAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
    }

    public async Task<IActionResult> OnPostVoteAsync()
    {
        try
        {
            await _featureRequestAppService.VoteAsync(Id);
        }
        catch (BusinessException exception)
            when (exception.Code == FeatureRequestPortalDomainErrorCodes.AlreadyVoted)
        {
            /* Can only happen when the same user votes from two tabs at once. */
            Alerts.Warning(L["FeatureRequestPortal:AlreadyVoted"].Value);
            await LoadAsync();
            return Page();
        }

        return RedirectToPage(new { id = Id });
    }

    public async Task<IActionResult> OnPostCommentAsync()
    {
        if (!ModelState.IsValid)
        {
            await LoadAsync();
            return Page();
        }

        await _featureRequestAppService.AddCommentAsync(Id, NewComment);

        return RedirectToPage(new { id = Id });
    }

    public async Task<IActionResult> OnPostChangeStatusAsync()
    {
        await _featureRequestAppService.ChangeStatusAsync(
            Id,
            new UpdateFeatureRequestStatusDto { Status = NewStatus }
        );

        return RedirectToPage(new { id = Id });
    }

    public async Task<IActionResult> OnPostDeleteAsync()
    {
        await _featureRequestAppService.DeleteAsync(Id);

        return RedirectToPage("/Index");
    }

    private async Task LoadAsync()
    {
        FeatureRequest = await _featureRequestAppService.GetAsync(Id);
        NewStatus = FeatureRequest.Status;
        Statuses = Enum.GetValues<FeatureRequestStatus>().ToList();
        DeleteConfirmationMessage = L["AreYouSureToDelete", FeatureRequest.Title];

        CanChangeStatus = await AuthorizationService.IsGrantedAsync(
            FeatureRequestPortalPermissions.FeatureRequests.ChangeStatus);

        CanDelete = await AuthorizationService.IsGrantedAsync(
            FeatureRequestPortalPermissions.FeatureRequests.Delete);
    }
}
