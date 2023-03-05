/*
  Factory components for SVG icons, which are not provided by currently used MUI,
  hence are either custom created or borrowed from other 3rd-party sources.
*/
import '@frontend/assets/styles/_svgIcons.scss';

import React from 'react';
import classNames from 'classnames';

export function BalanceIcon({ extraClassNames }) {
  // Taken from MUI v5
  // https://github.com/mui/material-ui/blob/master/packages/mui-icons-material/lib/Balance.js
  return (
    <svg viewBox="0 0 24 24" className={classNames('pev-svg-icon', extraClassNames)}>
      <path d="M13 7.83c.85-.3 1.53-.98 1.83-1.83H18l-3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3l-3-7h2V4h-6.17c-.41-1.17-1.52-2-2.83-2s-2.42.83-2.83 2H3v2h2l-3 7c0 1.66 1.57 3 3.5 3S9 14.66 9 13L6 6h3.17c.3.85.98 1.53 1.83 1.83V19H2v2h20v-2h-9V7.83zM20.37 13h-3.74l1.87-4.36L20.37 13zm-13 0H3.63L5.5 8.64 7.37 13zM12 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

export function ManageSearchIcon({ extraClassNames }) {
  // Taken from MUI v5
  // https://github.com/mui/material-ui/blob/master/packages/mui-icons-material/lib/ManageSearch.js
  return (
    <svg viewBox="0 0 24 24" className={classNames('pev-svg-icon', extraClassNames)}>
      <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z" />
    </svg>
  );
}
