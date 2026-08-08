using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FeatureRequestPortal.Accounts;
using FeatureRequestPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeatureRequestPortal.Web.Pages.Accounts;

[Authorize(FeatureRequestPortalPermissions.Users.Approve)]
public class PendingRegistrationsModel : FeatureRequestPortalPageModel
{
    public IReadOnlyList<PendingUserDto> PendingUsers { get; private set; } = Array.Empty<PendingUserDto>();

    private readonly IUserApprovalAppService _userApprovalAppService;

    public PendingRegistrationsModel(IUserApprovalAppService userApprovalAppService)
    {
        _userApprovalAppService = userApprovalAppService;
    }

    public async Task OnGetAsync()
    {
        PendingUsers = await _userApprovalAppService.GetPendingAsync();
    }

    public async Task<IActionResult> OnPostApproveAsync(Guid userId)
    {
        await _userApprovalAppService.ApproveAsync(userId);

        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostRejectAsync(Guid userId)
    {
        await _userApprovalAppService.RejectAsync(userId);

        return RedirectToPage();
    }
}
