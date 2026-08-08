using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FeatureRequestPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace FeatureRequestPortal.Accounts;

/// <summary>
/// The admin side of registration: accounts that proved their email address wait here until
/// somebody with the Approve permission lets them in or turns them down.
/// </summary>
[Authorize(FeatureRequestPortalPermissions.Users.Approve)]
public class UserApprovalAppService : FeatureRequestPortalAppService, IUserApprovalAppService
{
    private readonly IdentityUserManager _userManager;
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly IEmailSender _emailSender;

    public UserApprovalAppService(
        IdentityUserManager userManager,
        IRepository<IdentityUser, Guid> userRepository,
        IEmailSender emailSender)
    {
        _userManager = userManager;
        _userRepository = userRepository;
        _emailSender = emailSender;
    }

    public virtual async Task<List<PendingUserDto>> GetPendingAsync()
    {
        /* Verified but not yet activated. An account that has not confirmed its email is not an
         * application yet, so it deliberately stays out of the admin's queue. */
        var users = await _userRepository.GetListAsync(
            user => !user.IsActive && user.EmailConfirmed);

        return users
            .OrderBy(user => user.CreationTime)
            .Select(user => new PendingUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreationTime = user.CreationTime
            })
            .ToList();
    }

    public virtual async Task ApproveAsync(Guid userId)
    {
        var user = await _userManager.GetByIdAsync(userId);

        if (user.IsActive)
        {
            return;
        }

        user.SetIsActive(true);

        (await _userManager.UpdateAsync(user)).CheckErrors();

        await _emailSender.SendAsync(
            user.Email,
            L["Email:ApprovedSubject"],
            L["Email:ApprovedBody", user.UserName],
            isBodyHtml: true
        );
    }

    public virtual async Task RejectAsync(Guid userId)
    {
        var user = await _userManager.GetByIdAsync(userId);

        if (user.IsActive)
        {
            /* Never let a reject click delete an account that is already in use. */
            return;
        }

        (await _userManager.DeleteAsync(user)).CheckErrors();
    }
}
