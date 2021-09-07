type TSpecs<Collection, Circular> = Record<string, Collection | Circular>;
type TIntermediateSpecsValues = Array<string | number> | Record<string, number[]>;
type TIntermediateSpecs = [string, TIntermediateSpecsValues];
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUniqueSpecs extends TSpecs<Set<number | string>, IUniqueSpecs> {}
type TOutputSpecs = {
  name: string;
  values: TIntermediateSpecsValues;
  defaultUnit: string;
};
type TOutputMapping = {
  specs: TOutputSpecs[];
  categoryToSpecs: Record<string, string[]>;
};
type TMappedSpecs = {
  specs: IUniqueSpecs;
  categoryToSpecs: Record<string, Set<string>>;
};
type TProductTechSpec = {
  category: string;
  technicalSpecs: Array<{
    heading: string;
    defaultUnit: string;
    data: unknown;
  }>;
};

function mapUniqueSpecValues(
  specData: TProductTechSpec,
  mappedSpecs: TMappedSpecs,
  defaultUnits: Record<string, string>,
  headingToDataType: Record<string, 'primitive' | 'object' | 'array'>
) {
  const UNITLESS_SPEC = 'colour';

  specData.technicalSpecs.forEach((spec) => {
    if (spec.heading && (spec.defaultUnit || spec.heading === UNITLESS_SPEC)) {
      if (!defaultUnits[specData.category]) {
        defaultUnits[spec.heading] = spec.defaultUnit;
      }

      if (!mappedSpecs.specs[spec.heading]) {
        if (typeof spec.data === 'object' && !Array.isArray(spec.data)) {
          mappedSpecs.specs[spec.heading] = {};
          headingToDataType[spec.heading] = 'object';
        } else {
          if (Array.isArray(spec.data)) {
            headingToDataType[spec.heading] = 'array';
          } else {
            headingToDataType[spec.heading] = 'primitive';
          }

          mappedSpecs.specs[spec.heading] = new Set();
        }
      }

      if (headingToDataType[spec.heading] === 'object') {
        Object.entries(spec.data as Record<string, number>).forEach(([key, value]) => {
          const specProp = mappedSpecs.specs[spec.heading] as Record<string, Set<unknown>>;

          if (!specProp[key]) {
            specProp[key] = new Set();
          }

          specProp[key].add(value);
        });
      } else if (headingToDataType[spec.heading] === 'array') {
        (spec.data as string[]).forEach((data) => (mappedSpecs.specs[spec.heading] as Set<string>).add(data));
      } else {
        (mappedSpecs.specs[spec.heading] as Set<number>).add(spec.data as number);
      }

      mappedSpecs.categoryToSpecs[specData.category].add(spec.heading);
    }
  });
}

function mapMinMax(mappingSpecs: IUniqueSpecs): TIntermediateSpecs[] {
  return Object.entries(mappingSpecs).map(function doMapMinMax([key, value]): TIntermediateSpecs {
    const valueAsArray = Array.from(value as Set<number>);

    if (value instanceof Set || Array.isArray(value)) {
      if (valueAsArray.every(Number)) {
        return [key, [Math.min(...valueAsArray), Math.max(...valueAsArray)]];
      }

      return [key, valueAsArray];
    }

    return [
      key,
      // @ts-ignore
      Object.fromEntries(mapMinMax(value)),
    ];
  });
}

export default function mapProductsTechnicalSpecs(productTechSpecs: TProductTechSpec[]): TOutputMapping {
  const defaultUnits: Record<string, string> = {};
  const headingToDataType: Record<string, 'primitive' | 'object' | 'array'> = {};

  const mapping = productTechSpecs.reduce(
    (mappedSpecs: TMappedSpecs, specData) => {
      if (!mappedSpecs.categoryToSpecs[specData.category]) {
        mappedSpecs.categoryToSpecs[specData.category] = new Set();
      }

      mapUniqueSpecValues(specData, mappedSpecs, defaultUnits, headingToDataType);

      return mappedSpecs;
    },
    { specs: {}, categoryToSpecs: {} }
  );

  const outputMapping: TOutputMapping = {
    specs: mapMinMax(mapping.specs).map(([key, value]) => ({
      name: key,
      values: value,
      defaultUnit: defaultUnits[key],
    })),

    // @ts-ignore
    categoryToSpecs: Object.fromEntries(
      Object.entries(mapping.categoryToSpecs).map(([key, value]) => [key, Array.from(value)])
    ),
  };

  return outputMapping;
}
