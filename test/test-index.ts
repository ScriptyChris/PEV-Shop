import { sep } from 'path';

const findAssociatedSrcModulePath = (() => {
  const PATH_PARTS = {
    TEST: (() => {
      const DOUBLE_SEP = sep.repeat(2);

      return new RegExp(`(${DOUBLE_SEP}+)test(${DOUBLE_SEP}+)`);
    })(),
    SRC: '$1src$2',
    SPEC_JS_EXT: /\.spec\.ts$/,
    JS_EXT: '.ts',
  };

  return (): string => {
    // @ts-ignore
    const srcModulePath = require.main.filename
      .replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_JS_EXT, PATH_PARTS.JS_EXT);

    return srcModulePath;
  };
})();

export {
  findAssociatedSrcModulePath,
};
