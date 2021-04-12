import { sep } from 'path';

const findAssociatedSrcModulePath = (() => {
  const PATH_PARTS = {
    TEST: (() => {
      const OS_SEP = sep === '/' ? '/' : sep.repeat(2);

      return new RegExp(`(${OS_SEP}+)test(${OS_SEP}+)`);
    })(),
    SRC: '$1src$2',
    SPEC_TS_EXT: /\.spec\.ts$/,
    TS_EXT: '.ts',
  };

  return (): string => {
    // @ts-ignore
    let srcModulePath = require.main.filename;

    srcModulePath = srcModulePath
      .replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_TS_EXT, PATH_PARTS.TS_EXT);

    return srcModulePath;
  };
})();

export { findAssociatedSrcModulePath };
