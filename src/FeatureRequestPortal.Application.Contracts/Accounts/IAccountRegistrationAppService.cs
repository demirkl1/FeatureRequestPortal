using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace FeatureRequestPortal.Accounts;

public interface IAccountRegistrationAppService : IApplicationService
{
    /// <summary>
    /// Creates a locked account and emails a verification code. The account cannot sign in until
    /// the email is verified and an admin has approved it.
    /// </summary>
    Task<RegisterResultDto> RegisterAsync(RegisterUserDto input);

    /// <summary>Marks the email as confirmed when the code matches.</summary>
    Task VerifyEmailAsync(VerifyEmailDto input);

    /// <summary>Issues a fresh code, e.g. when the first one expired.</summary>
    Task ResendVerificationCodeAsync(Guid userId);
}

public interface IUserApprovalAppService : IApplicationService
{
    /// <summary>Accounts that verified their email and are waiting for an admin decision.</summary>
    Task<List<PendingUserDto>> GetPendingAsync();

    /// <summary>Activates the account and emails the user that they can sign in.</summary>
    Task ApproveAsync(Guid userId);

    /// <summary>Turns the application down and deletes the account.</summary>
    Task RejectAsync(Guid userId);
}
