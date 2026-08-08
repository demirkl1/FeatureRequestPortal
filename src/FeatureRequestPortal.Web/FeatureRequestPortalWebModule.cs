using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FeatureRequestPortal.EntityFrameworkCore;
using FeatureRequestPortal.Localization;
using FeatureRequestPortal.Web.Emailing;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Emailing;
using Volo.Abp.Emailing.Smtp;
using FeatureRequestPortal.MultiTenancy;
using FeatureRequestPortal.Web.Menus;
using Microsoft.OpenApi;
using OpenIddict.Validation.AspNetCore;
using Volo.Abp;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.AspNetCore.Mvc.UI;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity.Web;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.Web;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement.Web;
using Volo.Abp.Swashbuckle;
using Volo.Abp.TenantManagement.Web;
using Volo.Abp.OpenIddict;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.UI;
using Volo.Abp.UI.Navigation;
using Volo.Abp.VirtualFileSystem;

namespace FeatureRequestPortal.Web;

[DependsOn(
    typeof(FeatureRequestPortalHttpApiModule),
    typeof(FeatureRequestPortalApplicationModule),
    typeof(FeatureRequestPortalEntityFrameworkCoreModule),
    typeof(AbpAutofacModule),
    typeof(AbpIdentityWebModule),
    typeof(AbpSettingManagementWebModule),
    typeof(AbpAccountWebOpenIddictModule),
    typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule),
    typeof(AbpTenantManagementWebModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpSwashbuckleModule)
    )]
public class FeatureRequestPortalWebModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(
                typeof(FeatureRequestPortalResource),
                typeof(FeatureRequestPortalDomainModule).Assembly,
                typeof(FeatureRequestPortalDomainSharedModule).Assembly,
                typeof(FeatureRequestPortalApplicationModule).Assembly,
                typeof(FeatureRequestPortalApplicationContractsModule).Assembly,
                typeof(FeatureRequestPortalWebModule).Assembly
            );
        });

        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                options.AddAudiences("FeatureRequestPortal");
                options.UseLocalServer();
                options.UseAspNetCore();
            });
        });

        if (!hostingEnvironment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddProductionEncryptionAndSigningCertificate("openiddict.pfx", "8364deb2-5990-4717-995b-524eccf4df94");
            });
        }
        else
        {
            /* ABP's development certificates live in the OS certificate store, which on macOS is the
             * login Keychain. Signing a JWT then needs a Keychain authorisation the user has to click,
             * so a host started without a GUI session (CI, `dotnet run` from a detached shell) blocks
             * forever inside SecKeyCreateSignature on the first /connect/token call.
             * Ephemeral keys are held in memory only, which sidesteps the Keychain entirely.
             * They are regenerated on every restart, so tokens issued before a restart stop validating
             * - acceptable in development, and never used outside it. */
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddEphemeralEncryptionKey();
                serverBuilder.AddEphemeralSigningKey();
            });
        }
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        ConfigureAuthentication(context);
        ConfigureUrls(configuration);
        ConfigureBundles();
        ConfigureVirtualFileSystem(hostingEnvironment);
        ConfigureNavigationServices();
        ConfigureAutoApiControllers();
        ConfigureSwaggerServices(context.Services);
        ConfigureCors(context, configuration);
        ConfigureEmailing(context, configuration);

        context.Services.AddMapperlyObjectMapper<FeatureRequestPortalWebModule>();
    }

    private void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
        });
    }

    private void ConfigureBundles()
    {
        Configure<AbpBundlingOptions>(options =>
        {
            options.StyleBundles.Configure(
                LeptonXLiteThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );
        });
    }

    private void ConfigureVirtualFileSystem(IWebHostEnvironment hostingEnvironment)
    {
        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.ReplaceEmbeddedByPhysical<FeatureRequestPortalDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}FeatureRequestPortal.Domain.Shared"));
                options.FileSets.ReplaceEmbeddedByPhysical<FeatureRequestPortalDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}FeatureRequestPortal.Domain"));
                options.FileSets.ReplaceEmbeddedByPhysical<FeatureRequestPortalApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}FeatureRequestPortal.Application.Contracts"));
                options.FileSets.ReplaceEmbeddedByPhysical<FeatureRequestPortalApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}FeatureRequestPortal.Application"));
                options.FileSets.ReplaceEmbeddedByPhysical<FeatureRequestPortalWebModule>(hostingEnvironment.ContentRootPath);
            });
        }
    }

    private void ConfigureNavigationServices()
    {
        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new FeatureRequestPortalMenuContributor());
        });
    }

    private void ConfigureAutoApiControllers()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers.Create(typeof(FeatureRequestPortalApplicationModule).Assembly);
        });
    }

    /// <summary>
    /// The React SPA runs on its own origin (the Vite dev server), so the auto API controllers
    /// and the OpenIddict token endpoint have to accept cross-origin calls from it.
    /// </summary>
    private void ConfigureCors(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .WithOrigins(
                        configuration["App:CorsOrigins"]?
                            .Split(",", StringSplitOptions.RemoveEmptyEntries)
                            .Select(o => o.RemovePostFix("/"))
                            .ToArray() ?? Array.Empty<string>()
                    )
                    /* ABP signals a localized business error through this header; without
                     * exposing it the SPA cannot tell a business failure from a transport one. */
                    .WithExposedHeaders("_AbpErrorFormat")
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }

    /// <summary>
    /// Picks the email sender explicitly, because ABP swaps in a NullEmailSender for every
    /// development run - it only logs "USING NullEmailSender!" and drops the message, so a
    /// perfectly good SMTP configuration silently sends nothing.
    ///
    /// With a host configured we put the real SMTP sender back. Without one we write messages to
    /// Logs/emails, which keeps registration and password reset testable on a machine that has no
    /// mailbox credentials - and unlike the null sender it says so out loud.
    /// </summary>
    private void ConfigureEmailing(ServiceConfigurationContext context, IConfiguration configuration)
    {
        var smtpHost = configuration["Settings:Abp.Mailing.Smtp.Host"];

        context.Services.Replace(
            smtpHost.IsNullOrWhiteSpace()
                ? ServiceDescriptor.Transient<IEmailSender, FileEmailSender>()
                : ServiceDescriptor.Transient<IEmailSender, SmtpEmailSender>());
    }

    private void ConfigureSwaggerServices(IServiceCollection services)
    {
        services.AddAbpSwaggerGen(
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "FeatureRequestPortal API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
            }
        );
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
        }

        app.UseCorrelationId();
        app.MapAbpStaticAssets();
        /* ABP's own registration page is switched off, but its URL is what the login page links to
         * and what anyone who has seen an ABP app will try. Send it to our flow instead of a 404. */
        app.Use(async (httpContext, next) =>
        {
            if (httpContext.Request.Path.StartsWithSegments("/Account/Register"))
            {
                httpContext.Response.Redirect("/Accounts/SignUp");
                return;
            }

            await next();
        });

        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseAbpOpenIddictValidation();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        app.UseUnitOfWork();
        app.UseDynamicClaims();
        app.UseAuthorization();

        app.UseSwagger();
        app.UseAbpSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "FeatureRequestPortal API");
        });

        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints();
    }
}
