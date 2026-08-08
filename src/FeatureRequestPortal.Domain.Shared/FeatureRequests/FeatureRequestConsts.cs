namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// Both the entities (Domain) and the DTO validation attributes (Application.Contracts)
/// read the limits from here, so a rule is defined only once.
/// </summary>
public static class FeatureRequestConsts
{
    public const int MinTitleLength = 10;

    public const int MaxTitleLength = 200;

    public const int MaxDescriptionLength = 2000;

    /* The requirements document explicitly asks for a 100 character minimum for comments. */
    public const int MinCommentTextLength = 100;

    public const int MaxCommentTextLength = 2000;

    public const int DefaultPageSize = 15;

    /// <summary>
    /// The page sizes offered in the UI. The application service rejects anything else, so a
    /// crafted MaxResultCount cannot be used to pull the whole table in one request.
    /// </summary>
    public static readonly int[] AllowedPageSizes = { 15, 20, 30, 50 };
}
