using Microsoft.EntityFrameworkCore;
using FeatureRequestPortal.FeatureRequests;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace FeatureRequestPortal.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class FeatureRequestPortalDbContext :
    AbpDbContext<FeatureRequestPortalDbContext>,
    IIdentityDbContext,
    ITenantManagementDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

    public DbSet<FeatureRequest> FeatureRequests { get; set; }

    #region Entities from the modules

    /* Notice: We only implemented IIdentityDbContext and ITenantManagementDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityDbContext and ITenantManagementDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    //Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }
    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion

    public FeatureRequestPortalDbContext(DbContextOptions<FeatureRequestPortalDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own tables/entities inside here */

        builder.Entity<FeatureRequest>(b =>
        {
            b.ToTable(FeatureRequestPortalConsts.DbTablePrefix + "FeatureRequests", FeatureRequestPortalConsts.DbSchema);
            b.ConfigureByConvention(); //auto configure for the base class props

            b.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(FeatureRequestConsts.MaxTitleLength);

            b.Property(x => x.Description)
                .HasMaxLength(FeatureRequestConsts.MaxDescriptionLength);

            b.HasMany(x => x.Votes)
                .WithOne()
                .HasForeignKey(x => x.FeatureRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(x => x.Comments)
                .WithOne()
                .HasForeignKey(x => x.FeatureRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            /* The list is sorted by creation time (default) or vote count and
             * filtered by status, so those columns are indexed. */
            b.HasIndex(x => x.CreationTime);
            b.HasIndex(x => x.VoteCount);
            b.HasIndex(x => x.Status);
        });

        builder.Entity<Vote>(b =>
        {
            b.ToTable(FeatureRequestPortalConsts.DbTablePrefix + "Votes", FeatureRequestPortalConsts.DbSchema);
            b.ConfigureByConvention();

            /* Second safety net for the duplicate vote rule enforced by
             * FeatureRequest.AddVote: a user can vote only once per request. */
            b.HasIndex(x => new { x.FeatureRequestId, x.CreatorId }).IsUnique();
        });

        builder.Entity<Comment>(b =>
        {
            b.ToTable(FeatureRequestPortalConsts.DbTablePrefix + "Comments", FeatureRequestPortalConsts.DbSchema);
            b.ConfigureByConvention();

            b.Property(x => x.Text)
                .IsRequired()
                .HasMaxLength(FeatureRequestConsts.MaxCommentTextLength);

            b.HasIndex(x => x.FeatureRequestId);
        });
    }
}
