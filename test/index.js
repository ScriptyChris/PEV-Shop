const { sep } = require('path');

const findAssociatedSrcModulePath = (() => {
  const PATH_PARTS = {
    TEST: (() => {
      const DOUBLE_SEP = sep.repeat(2);

      return new RegExp(`(${DOUBLE_SEP}+)test(${DOUBLE_SEP}+)`);
    })(),
    SRC: '$1src$2',
    SPEC_JS_EXT: /\.spec\.js$/,
    JS_EXT: '.js',
  };

  return () => {
    const srcModulePath = require.main.filename
      .replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_JS_EXT, PATH_PARTS.JS_EXT);

    return srcModulePath;
  };
})();

module.exports = {
  findAssociatedSrcModulePath,
};
