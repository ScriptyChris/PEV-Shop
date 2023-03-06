import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme, createMuiTheme } from '@material-ui/core';

// eslint-disable-next-line no-var
declare var __IS_DEV_MODE__: string;

function MUIThemeProvider({ children }: React.PropsWithChildren<Record<string, unknown>>) {
  // TODO: [DX] refactor this after migrating to React v18 and MUI v5
  // https://github.com/mui/material-ui/issues/13394

  const _createMuiTheme = __IS_DEV_MODE__ ? unstable_createMuiStrictModeTheme : createMuiTheme;
  const muiTheme = _createMuiTheme({
    typography: {
      // based on HTML headings rendering spec
      // https://html.spec.whatwg.org/multipage/rendering.html#sections-and-headings
      h1: {
        fontSize: '2em',
      },
      h2: {
        fontSize: '1.5em',
      },
      h3: {
        fontSize: '1.17em',
      },
      h4: {
        fontSize: '1em',
      },
    },
  });
  console.log('muiTheme:', muiTheme);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <StylesProvider
      injectFirst
      // TODO: [build code redundancy] use that to prevent MUI from generating internal CSS
      // disableGeneration={true}
    >
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </StylesProvider>
  );
}

export default MUIThemeProvider;
