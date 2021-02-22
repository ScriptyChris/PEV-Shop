import { sep } from 'path';

declare global {
  type TJestMock<T = void> = jest.Mock<any, T | any>;
}

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
    const srcModulePath = require.main.filename
      .replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_TS_EXT, PATH_PARTS.TS_EXT);

    return srcModulePath;
  };
})();

export { findAssociatedSrcModulePath };
