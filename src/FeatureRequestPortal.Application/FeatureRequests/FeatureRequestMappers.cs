using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace FeatureRequestPortal.FeatureRequests;

/* This template uses Mapperly (not AutoMapper) as the object mapper. One-way mappers
 * derive from MapperBase, which is how AddMapperlyObjectMapper discovers them and
 * makes them available through IObjectMapper. */

[Mapper]
public partial class FeatureRequestToFeatureRequestDtoMapper : MapperBase<FeatureRequest, FeatureRequestDto>
{
    public override partial FeatureRequestDto Map(FeatureRequest source);

    public override partial void Map(FeatureRequest source, FeatureRequestDto destination);
}

[Mapper]
public partial class FeatureRequestToFeatureRequestDetailDtoMapper : MapperBase<FeatureRequest, FeatureRequestDetailDto>
{
    /* HasCurrentUserVoted is filled in by the application service from the current user's votes. */
    [MapperIgnoreTarget(nameof(FeatureRequestDetailDto.HasCurrentUserVoted))]
    public override partial FeatureRequestDetailDto Map(FeatureRequest source);

    [MapperIgnoreTarget(nameof(FeatureRequestDetailDto.HasCurrentUserVoted))]
    public override partial void Map(FeatureRequest source, FeatureRequestDetailDto destination);
}

[Mapper]
public partial class CommentToCommentDtoMapper : MapperBase<Comment, CommentDto>
{
    /* CreatorName is resolved from the identity module by the application service. */
    [MapperIgnoreTarget(nameof(CommentDto.CreatorName))]
    public override partial CommentDto Map(Comment source);

    [MapperIgnoreTarget(nameof(CommentDto.CreatorName))]
    public override partial void Map(Comment source, CommentDto destination);
}
