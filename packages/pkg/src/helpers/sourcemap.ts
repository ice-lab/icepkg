import remapping, {type DecodedSourceMap, type RawSourceMap } from '@ampproject/remapping';

const nullSourceMap: RawSourceMap = {
  names: [],
  sources: [],
  mappings: '',
  version: 3,
};

export function combineSourcemaps(
  filename: string,
  sourcemapList: Array<DecodedSourceMap | RawSourceMap>,
): RawSourceMap {
  if (
    sourcemapList.length === 0 ||
    sourcemapList.every((m) => m.sources.length === 0)
  ) {
    return { ...nullSourceMap };
  }

  // We don't declare type here so we can convert/fake/map as RawSourceMap
  let map; // : SourceMap
  let mapIndex = 1;
  const useArrayInterface =
    sourcemapList.slice(0, -1)
      .find((m) => m.sources.length !== 1) === undefined;
  if (useArrayInterface) {
    map = remapping(sourcemapList, () => null, true);
  } else {
    map = remapping(
      sourcemapList[0],
      (sourcefile) => {
        if (sourcefile === filename && sourcemapList[mapIndex]) {
          return sourcemapList[mapIndex++];
        } else {
          return { ...nullSourceMap };
        }
      },
      true,
    );
  }
  if (!map.file) {
    delete map.file;
  }

  return map as RawSourceMap;
}
