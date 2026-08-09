namespace FeatureRequestPortal.MultiTenancy;

public static class MultiTenancyConsts
{
    /* Off: the portal serves one company, so there is nothing to partition by tenant. Leaving it on
     * put a "Tenant: not selected / switch" box on the login page, which asks the visitor to make a
     * choice that has no meaning here. */
    public const bool IsEnabled = false;
}
