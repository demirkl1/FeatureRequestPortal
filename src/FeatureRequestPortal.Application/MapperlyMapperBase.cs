using Volo.Abp.Mapperly;

namespace FeatureRequestPortal;

/// <summary>
/// <see cref="IAbpMapperlyMapper{TSource,TDestination}"/> also requires BeforeMap/AfterMap
/// hooks. Mappers that do not need them derive from this base instead of repeating
/// empty methods.
/// </summary>
public abstract class MapperlyMapperBase<TSource, TDestination> : IAbpMapperlyMapper<TSource, TDestination>
{
    public abstract TDestination Map(TSource source);

    public abstract void Map(TSource source, TDestination destination);

    public virtual void BeforeMap(TSource source)
    {
    }

    public virtual void AfterMap(TSource source, TDestination destination)
    {
    }
}
