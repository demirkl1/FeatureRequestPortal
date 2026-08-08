using System;
using System.ComponentModel.DataAnnotations;

namespace FeatureRequestPortal.Accounts;

public class RegisterUserDto
{
    [Required]
    [StringLength(AccountConsts.MaxUserNameLength)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(AccountConsts.MaxEmailLength)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}

public class VerifyEmailDto
{
    [Required]
    public Guid UserId { get; set; }

    /// <summary>The six digit code emailed on registration.</summary>
    [Required]
    [StringLength(AccountConsts.VerificationCodeLength, MinimumLength = AccountConsts.VerificationCodeLength)]
    public string Code { get; set; } = string.Empty;
}

/// <summary>A verified account still waiting for an admin to let it in.</summary>
public class PendingUserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateTime CreationTime { get; set; }
}

/// <summary>Where the user should be sent after a successful registration.</summary>
public class RegisterResultDto
{
    public Guid UserId { get; set; }
}
