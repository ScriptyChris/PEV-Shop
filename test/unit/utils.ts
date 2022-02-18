import { sep } from 'path';

const CWD = process.cwd();

const findAssociatedSrcModulePath = (() => {
  const PATH_PARTS = {
    TEST: (() => {
      const OS_SEP = sep === '/' ? '/' : sep.repeat(2);

      return new RegExp(`(${OS_SEP}+)test(${OS_SEP}+)unit(${OS_SEP}+)`);
    })(),
    SRC: '$1src$2',
    SPEC_TS_EXT: /\.spec\.ts$/,
    TS_EXT: '.ts',
  };

  return (): string => {
    const srcModulePath = require
      .main!.filename.replace(PATH_PARTS.TEST, PATH_PARTS.SRC)
      .replace(PATH_PARTS.SPEC_TS_EXT, PATH_PARTS.TS_EXT);

    return srcModulePath;
  };
})();

const getRootRelativePath = (targetPath: string) => `${CWD}/${targetPath}`;

const mockAndRequireModule = (path: string) => {
  const relativePath = path.includes('/') ? getRootRelativePath(path) : path;

  return jest.mock(relativePath).requireMock(relativePath);
};

export { findAssociatedSrcModulePath, getRootRelativePath, mockAndRequireModule };
