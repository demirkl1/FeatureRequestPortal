namespace FeatureRequestPortal.Accounts;

public static class AccountConsts
{
    /// <summary>
    /// Length of the code emailed on registration. ASP.NET Core Identity's email token provider
    /// is TOTP based and always produces six digits, so this is a mirror of that, not a knob.
    /// </summary>
    public const int VerificationCodeLength = 6;

    /// <summary>Purpose string tying a generated token to email verification only.</summary>
    public const string EmailVerificationPurpose = "FeatureRequestPortal:EmailVerification";

    /* Identity exposes its own limits as static readonly fields, which C# will not accept inside
     * a validation attribute, so the same numbers are mirrored here as real constants. */
    public const int MaxUserNameLength = 256;

    public const int MaxEmailLength = 256;
}
