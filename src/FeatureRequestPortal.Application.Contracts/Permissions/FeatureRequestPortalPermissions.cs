namespace FeatureRequestPortal.Permissions;

public static class FeatureRequestPortalPermissions
{
    public const string GroupName = "FeatureRequestPortal";

    public static class FeatureRequests
    {
        public const string Default = GroupName + ".FeatureRequests";

        /* Creating, voting and commenting only require an authenticated user, so they are
         * guarded by [Authorize] instead of a permission. These two are admin-only. */
        public const string ChangeStatus = Default + ".ChangeStatus";

        public const string Delete = Default + ".Delete";
    }

    public static class Users
    {
        public const string Default = GroupName + ".Users";

        /// <summary>Lets an admin let a newly registered account into the portal.</summary>
        public const string Approve = Default + ".Approve";
    }
}
