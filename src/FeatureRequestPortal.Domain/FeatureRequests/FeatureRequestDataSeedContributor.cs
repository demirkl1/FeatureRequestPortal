using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;

namespace FeatureRequestPortal.FeatureRequests;

/// <summary>
/// Seeds a realistic set of car feature requests so paging, sorting and filtering
/// can be demonstrated on a fresh database.
/// </summary>
public class FeatureRequestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IFeatureRequestRepository _featureRequestRepository;
    private readonly IGuidGenerator _guidGenerator;

    public FeatureRequestDataSeedContributor(
        IFeatureRequestRepository featureRequestRepository,
        IGuidGenerator guidGenerator)
    {
        _featureRequestRepository = featureRequestRepository;
        _guidGenerator = guidGenerator;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (await _featureRequestRepository.GetCountAsync() > 0)
        {
            return;
        }

        /* Fixed voter ids so the seeded vote counts stay reproducible. */
        var voters = new Guid[20];
        for (var i = 0; i < voters.Length; i++)
        {
            voters[i] = _guidGenerator.Create();
        }

        var seeds = new[]
        {
            ("Wireless smartphone charging in the center console", "A charging pad in the center console would remove the need for cables on daily commutes.", FeatureRequestStatus.Completed, 18),
            ("Heated steering wheel as standard equipment", "Heated seats are already standard, a heated steering wheel would make winter mornings much better.", FeatureRequestStatus.Approved, 17),
            ("360 degree parking camera", "A bird's eye view around the car would make parking in tight city spots far easier.", FeatureRequestStatus.Planned, 16),
            ("Ventilated seats for hot climates", "Perforated and actively cooled seats would help a lot during long summer drives.", FeatureRequestStatus.Approved, 15),
            ("Physical buttons for climate control", "Touch only climate controls are distracting while driving, please keep real buttons.", FeatureRequestStatus.Approved, 14),
            ("Vehicle to load power outlet", "A 220V outlet in the trunk would let us power tools and camping equipment.", FeatureRequestStatus.Planned, 13),
            ("Head-up display with navigation arrows", "Projecting the next turn onto the windshield keeps the driver's eyes on the road.", FeatureRequestStatus.Approved, 12),
            ("Digital key with phone and smartwatch", "Unlocking and starting the car from a phone would remove the need to carry a key fob.", FeatureRequestStatus.Approved, 11),
            ("Frunk storage on electric models", "The space under the front hood is wasted, a sealed frunk would add useful storage.", FeatureRequestStatus.Pending, 10),
            ("Adaptive cruise control with stop and go", "Traffic jam assist that fully stops and resumes would reduce fatigue in city traffic.", FeatureRequestStatus.Approved, 9),
            ("Built-in dashcam with cloud storage", "A factory dashcam recording front and rear would help with insurance claims.", FeatureRequestStatus.Pending, 8),
            ("Panoramic roof with electric sunshade", "A full glass roof makes the cabin feel larger, but it needs a proper electric shade.", FeatureRequestStatus.Approved, 7),
            ("Rear seat climate zone", "Passengers in the back should be able to set their own temperature.", FeatureRequestStatus.Pending, 6),
            ("Offline maps in the navigation system", "Navigation should keep working in tunnels and rural areas without mobile coverage.", FeatureRequestStatus.Approved, 5),
            ("Trailer hitch preparation from the factory", "A factory wiring harness for a tow bar is much cleaner than an aftermarket install.", FeatureRequestStatus.Rejected, 4),
            ("Manual gearbox option on the sport trim", "Enthusiasts would pay extra for a proper manual transmission on the sport model.", FeatureRequestStatus.Cancelled, 3),
            ("Solar panel roof for the 12V battery", "A small solar panel could keep the auxiliary battery topped up while parked.", FeatureRequestStatus.Rejected, 2),
            ("Pet mode that keeps the cabin cool", "A mode that keeps the air conditioning running and shows a message on the screen.", FeatureRequestStatus.Pending, 2),
            ("Configurable driver profiles per key", "Seat, mirror and audio settings should follow whoever unlocks the car.", FeatureRequestStatus.Approved, 1),
            ("Ambient lighting with custom colors", "Being able to pick the interior lighting color would personalize the cabin.", FeatureRequestStatus.Pending, 0)
        };

        foreach (var (title, description, status, voteCount) in seeds)
        {
            var featureRequest = new FeatureRequest(
                _guidGenerator.Create(),
                title,
                description,
                status
            );

            for (var i = 0; i < voteCount; i++)
            {
                featureRequest.AddVote(_guidGenerator.Create(), voters[i]);
            }

            await _featureRequestRepository.InsertAsync(featureRequest);
        }
    }
}
