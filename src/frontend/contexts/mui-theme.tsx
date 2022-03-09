import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme, createMuiTheme } from '@material-ui/core';

// eslint-disable-next-line no-var
declare var __IS_DEV_MODE__: string;

function MUIThemeProvider({ children }) {
  // TODO: [DX] refactor this after migrating to React v18 and MUI v5
  // https://github.com/mui/material-ui/issues/13394

  const _createMuiTheme = __IS_DEV_MODE__ ? unstable_createMuiStrictModeTheme : createMuiTheme;

  return <ThemeProvider theme={_createMuiTheme()}>{children}</ThemeProvider>;
}

export { MUIThemeProvider };
