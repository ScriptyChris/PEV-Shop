import { sep } from 'path';

const findAssociatedSrcModulePath = (() => {
  const PATH_PARTS = {
    TEST: (() => {
      const DOUBLE_SEP = sep.repeat(2);

      return new RegExp(`(${DOUBLE_SEP}+)test(${DOUBLE_SEP}+)`);
    })(),
    SRC: '$1src$2',
    SPEC_TS_EXT: /\.spec\.ts$/,
    TS_EXT: '.ts',
  };

  return (): string => {
    // @ts-ignore
    let srcModulePath = require.main.filename;

    console.log('???[0] srcModulePath:', srcModulePath, ' /PATH_PARTS:', Object.entries(PATH_PARTS));

    srcModulePath = srcModulePath
      .replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_TS_EXT, PATH_PARTS.TS_EXT);

    console.log('???[1] srcModulePath:', srcModulePath);

    return srcModulePath;
  };
})();

export { findAssociatedSrcModulePath };
